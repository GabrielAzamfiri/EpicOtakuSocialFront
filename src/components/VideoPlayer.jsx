function VideoPlayer({ videoUrl }) {
  return (
    <div>
      {videoUrl ? (
        <iframe
          className="border rounded"
          width="495px"
          height="280px"
          src={videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      ) : (
        <div
          className="video-fallback"
          style={{
            width: "500px",
            height: "280px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "15px",
            backgroundColor: "#333",
            color: "#fff",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
            fontSize: "1.5rem",
            textAlign: "center",
          }}
        >
          Video not available! 😭
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
