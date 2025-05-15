import { useSelector } from 'react-redux';
import { useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { SpeechContext } from '../context/SpeechContext';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { appId, serverSecret } from '../Config';
import { deletePersonalMeeting, endMeeting, saveMeetingData } from '../utils/api';
import recognition from '../utils/speechRecognition';
import { useDispatch } from 'react-redux';
import { clearTranscript } from '../redux/slices/transcriptSlice';
import { useUser } from '../context/UserContext'; // adjust path as needed

function Room() {
  const dispatch = useDispatch();
  const { roomid } = useParams();
  const myMeeting = useRef(null);
  const transcript = useSelector(state => state.transcript);
  const transcriptRef = useRef("");
  const { isListening, setIsListening, withRecording } = useContext(SpeechContext);
  const { role } = useUser(); // moved inside the component

  useEffect(() => {
    transcriptRef.current = transcript; // keep latest transcript in ref
  }, [transcript]);

  useEffect(() => {
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomid,
      Date.now().toString(),
      Date.now().toString()
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: myMeeting.current,
      sharedLinks: [
        {
          name: 'Personal link',
          url:
            window.location.protocol + '//' +
            window.location.host + window.location.pathname +
            '?roomID=' +
            roomid,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: true,
      layout: 'Gallery',
      onLeaveRoom: async () => {
        console.log("Final Transcript:", transcriptRef.current);

        if (role === 'admin') {
          if (withRecording) {
            await endMeeting(roomid);
            alert('Meeting saved to Previous Meetings And Notes Available in a few seconds...😄');
            window.location.href = '/dashboard';
            const summary = await saveMeetingData(roomid, transcriptRef.current);
            console.log('AI Summary:', summary);

            if (isListening) {
              recognition.stop();
              setIsListening(false);
              console.log("Speech recognition stopped");
            }

            dispatch(clearTranscript());
            await deletePersonalMeeting(roomid);
            console.log(`Meeting with ID ${roomid} has been deleted.`);
          } else {
            await endMeeting(roomid);
            alert('Meeting saved to Previous Meetings...😄');
            await deletePersonalMeeting(roomid);
            console.log(`Meeting with ID ${roomid} has been deleted.`);
          }
        } else {
          alert('You have left the meeting.');
        }

        window.location.href = '/dashboard';
      },
    });

    return () => {
      zp.destroy();
      recognition.stop();
      setIsListening(false);
    };
  }, [roomid]);

  return (
    <div className="w-screen h-screen bg-gray-900 text-white">
      <h1 className="text-center text-2xl font-bold py-4">
        Room: {roomid}
      </h1>
      <div className="w-full h-[calc(100vh-4rem)]" ref={myMeeting}></div>
    </div>
  );
}

export default Room;
