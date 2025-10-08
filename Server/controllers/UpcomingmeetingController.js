const Meeting = require("../models/Meeting");
const User = require("../models/User");
const nodemailer = require("nodemailer");

exports.createMeeting = async (req, res) => {
  try {
    const { title, date } = req.body;

    // Get the team leader (the user creating the meeting)
    const teamLeader = await User.findById(req.user.id).populate("teamMembers");

    if (!teamLeader || !teamLeader.teamMembers.length) {
      return res.status(400).json({ message: "No team members found" });
    }

    // Extract participant IDs from team members
    const participants = teamLeader.teamMembers.map((member) => member._id);

    // Create and save the meeting
    const meeting = new Meeting({
      title,
      date,
      participants,
      createdBy: req.user.id,
    });

    await meeting.save();

    // Email setup using Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let emailFailed = false;

    // Send email to each team member
    for (let member of teamLeader.teamMembers) {
      const mailOptions = {
        from: `"${teamLeader.name}" <${teamLeader.email}>`,
        to: member.email,
        subject: `New Meeting Scheduled: ${title}`,
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333; }
              .container { max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              h2 { color: #4CAF50; }
              p { font-size: 16px; line-height: 1.6; }
              .highlight { font-weight: bold; color: #333; }
              .footer { margin-top: 30px; font-size: 13px; color: #888; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Meeting Scheduled</h2>
              <p>Hello <span class="highlight">${member.name}</span>,</p>
              <p>Your team leader <span class="highlight">${teamLeader.name}</span> has scheduled a meeting.</p>
              <p><span class="highlight">Title:</span> ${title}</p>
              <p><span class="highlight">Date & Time:</span> ${new Date(date).toLocaleString()}</p>
              <p>Please be on time and come prepared.</p>
              <div class="footer">
                © ${new Date().getFullYear()} Your Company. All rights reserved.
              </div>
            </div>
          </body>
        </html>
      `,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.error(`Error sending email to ${member.email}:`, err);
        emailFailed = true; // mark email failure
      }
    }

    if (emailFailed) {
      res.status(201).json({
        message: "Meeting created, but some emails could not be sent.",
        meeting,
      });
    } else {
      res.status(201).json({ message: "Meeting created and all emails sent successfully.", meeting });
    }
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({ message: "Error creating meeting", error });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    let createdByIds = [req.user.id]; // Default: fetch user's own meetings

    // If the user is a team member and has a teamLeader
    if (currentUser.teamLeader) {
      createdByIds.push(currentUser.teamLeader); // Also fetch meetings created by their teamLeader
    }

    const meetings = await Meeting.find({ createdBy: { $in: createdByIds } });

    res.status(200).json({ meetings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching meetings", error });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    if (meeting.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await meeting.deleteOne();
    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting meeting", error });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    if (meeting.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    meeting.title = req.body.title || meeting.title;
    meeting.date = req.body.date || meeting.date;

    const updatedMeeting = await meeting.save();
    res.status(200).json({ message: "Meeting updated", updatedMeeting });
  } catch (error) {
    res.status(500).json({ message: "Error updating meeting", error });
  }
};
