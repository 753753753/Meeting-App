import React, { useEffect, useRef, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { appId, serverSecret } from '../Config';
import { endMeeting } from '../utils/api'; // <-- Import it
import { recognition } from '../utils/speechRecognition';
import { SpeechContext } from '../context/SpeechContext';
import { saveMeetingData } from '../utils/api';

function Room() {
  const { roomid } = useParams();
  const myMeeting = useRef(null);
  const transcriptRef = useRef(""); // <-- Add this ref

  const { transcript, setIsListening, setTranscript, isListening, withRecording } = useContext(SpeechContext);

  useEffect(() => {
    transcriptRef.current = transcript; // <-- Always keep it updated
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
        console.log("before", transcriptRef.current); // <-- Use ref here

        if (withRecording) {
          await endMeeting(roomid);
          console.log("Final Transcript:", transcriptRef.current);

          alert('Meeting saved to Previous Meetings And Notes Available in a few seconds...😄');
          window.location.href = '/dashboard';

          const summary = await saveMeetingData(roomid, transcriptRef.current);
          console.log('AI Summary:', summary);

          if (isListening) {
            recognition.stop();
            console.log("Speech recognition stopped");
            setIsListening(false);
          }

          setTranscript("");
        } else {
          await endMeeting(roomid);
          alert('Meeting saved to Previous Meetings...😄');
          window.location.href = '/dashboard';
        }
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