import { z } from "zod";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
} from "remotion";
import { CompositionProps } from "../../types/constants";
import { loadFont, fontFamily } from "@remotion/google-fonts/FjallaOne";
import {
  loadFont as archivoBlackLoad,
  fontFamily as fontArchivo,
} from "@remotion/google-fonts/ArchivoBlack";
import React, { useMemo } from "react";

loadFont();
archivoBlackLoad();

const container: React.CSSProperties = {
  backgroundColor: "black",
  justifyContent: "center",
  alignItems: "center",
};

const overlayTextStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "20px",
  width: "100%",
  textAlign: "center",
  fontSize: "40px",
  color: "white",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  padding: "10px",
  fontFamily: fontArchivo,
};

export const Main = ({ title }: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene durations
  const scene1Duration = Math.floor(2.5 * fps); // 2.5 seconds for Scene 1
  const scene2Duration = Math.floor(3 * fps); // 3 seconds for Scene 2
  const transitionDuration = Math.floor(0.5 * fps); // 0.5-second transition

  // Fade-out and zoom-in effect for "TOP 5 Movies" text
  const opacity = interpolate(frame, [0, scene1Duration], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [0, scene1Duration], [1, 1.2], {
    extrapolateRight: "clamp",
  });

  const titleStyle: React.CSSProperties = useMemo(() => {
    return {
      fontFamily,
      fontSize: 80,
      color: "white",
      textAlign: "center",
      height: "55%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
  }, []);

  const sampleMovies = [
    {
      id: 1,
      title: "1. The Matrix",
      imageUrl:
        "https://cdn.pixabay.com/photo/2024/05/27/07/46/bee-8790316_640.jpg",
    },
    {
      id: 2,
      title: "2. Inception",
      imageUrl:
        "https://cdn.pixabay.com/photo/2024/05/27/07/46/bee-8790316_640.jpg",
    },
    {
      id: 3,
      title: "3. Interstellar",
      imageUrl:
        "https://cdn.pixabay.com/photo/2024/05/27/07/46/bee-8790316_640.jpg",
    },
    {
      id: 4,
      title: "4. The Dark Knight",
      imageUrl:
        "https://cdn.pixabay.com/photo/2024/05/27/07/46/bee-8790316_640.jpg",
    },
    {
      id: 5,
      title: "5. Gladiator",
      imageUrl:
        "https://cdn.pixabay.com/photo/2024/05/27/07/46/bee-8790316_640.jpg",
    },
  ];

  return (
    <AbsoluteFill style={container}>
      {/* Scene 1: "TOP 5 Movies" Text Animation */}
      <Sequence durationInFrames={scene1Duration}>
        <AbsoluteFill>
          <h1
            style={{
              ...titleStyle,
              opacity,
              transform: `scale(${scale})`,
            }}
          >
            Top 5 Best Movies
          </h1>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Loop through each movie with a fade-in effect */}
      {sampleMovies.map((movie, index) => {
        const startFrame = scene1Duration + index * scene2Duration;
        const movieOpacity = interpolate(
          frame,
          [startFrame, startFrame + transitionDuration],
          [0, 1],
          { extrapolateRight: "clamp" },
        );

        // Zoom-in effect for the image
        const imageScale = interpolate(
          frame,
          [startFrame, startFrame + scene2Duration],
          [1, 1.1], // Adjust the final scale to control zoom strength
          { extrapolateRight: "clamp" },
        );

        return (
          <Sequence
            key={movie.id}
            from={startFrame}
            durationInFrames={scene2Duration}
          >
            <AbsoluteFill style={{ opacity: movieOpacity }}>
              <Img
                src={movie.imageUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${imageScale})`,
                }}
                alt={movie.title}
              />
              <div style={overlayTextStyle}>{movie.title}</div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
