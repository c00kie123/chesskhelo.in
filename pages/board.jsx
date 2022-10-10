import dynamic from "next/dynamic";
import styled from "styled-components";
import { useState } from "react";

import { BREAK_POINTS } from "../styles/Responsive";
import PgnContainer from "../components/PgnContainer";
import { useChessState } from "../store/chess";

const DynamicBoard = dynamic(() => import("../components/Board/Board"), {
  ssr: false,
});

const MainContainer = styled.div`
  display: flex;
  width: 100vw;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;

  ${BREAK_POINTS.mobile`
    flex-direction: column;
    align-items: center;
  `} ${BREAK_POINTS.tablet`
    flex-direction: column;
    align-items: center;
  `} ${BREAK_POINTS.laptop`
    flex-direction: column;
    align-items: center;
  `};
`;

const SideContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  height: 90vh;
  width: 100%;
  min-width: 200px;
  max-width: 500px;
  overflow: hidden;
  margin-right: ${({ theme }) => theme.layout.spaces.large};
  border-radius: ${({ theme }) => theme.layout.standardBorderRadius};

  ${BREAK_POINTS.mobile`
    max-width: 95vw;
    max-height: 700px;
    margin-left: 20px;
  `} ${BREAK_POINTS.tablet`
    max-width: 95vw;
    max-height: 700px;
    margin-left: 20px;
  `} ${BREAK_POINTS.laptop`
    max-width: 95vw;
    max-height: 700px;
    margin-left: 20px;
  `};
`;

const FenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary.green};
  width: 100%;
  height: auto;
  font-size: 13px;
`;

const SidebarHeader = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.primary.blue};
  height: 60px;
  width: 100%;
  padding: ${({ theme }) => theme.layout.spaces.extraSmall};
`;

const SidebarHeaderButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 100%;
  min-width: 120px;
  width: auto;
  margin: auto;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.layout.standardBorderRadius};

  :hover {
    background-color: ${({ theme }) => theme.colors.primary.pink};
  }
`;

const FenTitle = styled.div`
  padding: ${({ theme }) => theme.layout.spaces.extraSmall};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.layout.spaces.extraSmall};
`;

const Fen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  min-width: 90%;
  padding: ${({ theme }) => theme.layout.spaces.extraSmall};
  border-radius: ${({ theme }) => theme.layout.standardBorderRadius};
  margin-bottom: ${({ theme }) => theme.layout.spaces.extraSmall};
`;

const SidebarHeaderIcon = styled.img`
  width: 22px;
  height: 22px;
  margin-bottom: ${({ theme }) => theme.layout.spaces.extraSmall};
`;

const Margin = styled.div`
  margin: ${({ theme }) => theme.layout.spaces.large};
`;

export default function Board() {
  const [chessState, chessStateActions] = useChessState();
  const [renderBoard, setRenderBoard] = useState(true);

  const copyToClipboard = (item) => {
    navigator.clipboard.writeText(
      item === "fen" ? chessState.chess.fen() : chessState.chess.pgn()
    );
    //Todo: replace alert with toast
    alert(`${item === "fen" ? "FEN" : "PGN"} copied to clipboard!`);
  };

  const resetBoard = () => {
    chessStateActions.resetChess();
    setRenderBoard(false);
    setTimeout(() => {
      setRenderBoard(true);
    }, []);
  };

  const headerProperties = [
    {
      onClick: () => copyToClipboard("fen"),
      src: "/icons/copy-icon.svg",
      text: "Copy FEN",
    },
    {
      onClick: () => copyToClipboard("pgn"),
      src: "/icons/copy-icon.svg",
      text: "Copy PGN",
    },
    {
      onClick: resetBoard,
      src: "/icons/reload.svg",
      text: "Reset Board",
    },
  ];

  return (
    <MainContainer>
      {renderBoard && (
        <DynamicBoard
          isWhitePlayer={true}
          isPlayable={true}
          allowBothSideMoves={true}
        />
      )}
      <Margin />
      <SideContainer>
        <SidebarHeader>
          {headerProperties.map((button) => (
            <SidebarHeaderButton onClick={button.onClick}>
              <SidebarHeaderIcon src={button.src} />
              <text>{button.text}</text>
            </SidebarHeaderButton>
          ))}
        </SidebarHeader>
        <FenContainer>
          <FenTitle>Forsyth-Edwards Notation (FEN)</FenTitle>
          <Fen>{chessState.chess.fen()}</Fen>
        </FenContainer>
        <PgnContainer />
      </SideContainer>
    </MainContainer>
  );
}
