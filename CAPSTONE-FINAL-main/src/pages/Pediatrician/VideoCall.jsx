import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./API";
import ReactPlayer from "react-player";

function JoinScreen({ getMeetingAndToken, setCalling }) {
  const [meetingId, setMeetingId] = useState(null);
  const onClick = async () => {
    await getMeetingAndToken(meetingId);
  };
  return (
    <div className="h-[100vh] flex flex-col justify-center items-center">
      <div className="flex items-center rounded-md bg-green-400 py-4 px-10">
        <input
          type="text"
          className="rounded-full"
          placeholder="Enter Meeting Id"
          onChange={(e) => {
            setMeetingId(e.target.value);
          }}
        />
        <div className="ml-5">
          <button onClick={onClick} className="font-semibold">
            Create Meeting
          </button>
        </div>
      </div>
      <button
        onClick={() => setCalling(false)}
        className="text-blue-600 text-xl my-2 font-extrabold"
      >
        Back to chat
      </button>
    </div>
  );
}

function ParticipantView(props) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div className="flex flex-col items-center">
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn ? (
        <ReactPlayer
          playsinline
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream}
          height={"500px"} // Enlarged height
          width={"500px"}  // Enlarged width
          style={{ borderRadius: "10px" }}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      ) : (
        <div className="flex justify-center items-center h-[500px] w-[500px] border rounded-lg">
          <div className="border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
    </div>
  );
}

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div className="items-center justify-center flex space-x-2 mt-4">
      <button className="bg-slate-300 p-3 rounded-lg font-bold" onClick={() => leave()}>
        Leave
      </button>
      <button className="bg-slate-300 p-3 rounded-lg font-bold" onClick={() => toggleMic()}>
        On Mic
      </button>
      <button className="bg-slate-300 p-3 rounded-lg font-bold" onClick={() => toggleWebcam()}>
        Toggle Cam
      </button>
    </div>
  );
}

function MeetingView(props) {
  const [joined, setJoined] = useState(null);
  const { join, participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
  });

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100vh]">
      {/* Back button */}
      <button
        onClick={() => props.setCalling(false)} // Go back to chat or previous screen
        className="text-blue-600 text-xl my-2 font-extrabold"
      >
        Back to chat
      </button>

      <h3 className="bg-green-600 rounded-md text-white p-5 text-xl font-bold">
        Meeting Id: {props.meetingId}
      </h3>

      {joined && joined === "JOINED" ? (
        <div className="flex flex-col items-center">
          <Controls />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 justify-center">
            {[...participants.keys()].map((participantId) => (
              <div
                key={participantId}
                className="flex-shrink-0 w-[500px] h-[550px] border rounded-lg shadow-lg p-4 bg-white"
              >
                <ParticipantView participantId={participantId} />
              </div>
            ))}
          </div>
        </div>
      ) : joined && joined === "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button
          className="bg-blue-500 mt-5 px-10 py-3 rounded-full text-white font-bold"
          onClick={joinMeeting}
        >
          Join
        </button>
      )}
    </div>
  );
}

function VideoCall({ user, setCalling }) {
  const [meetingId, setMeetingId] = useState(null);

  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "DR. " + user,
      }}
      token={authToken}
    >
      <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} setCalling={setCalling} />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} setCalling={setCalling} />
  );
}


export default VideoCall;