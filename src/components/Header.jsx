import { useState } from "react";

export default function Header() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <header>
        <div className="logoContainer">
          <svg
            id="logo"
            width="800px"
            height="800px"
            viewBox="0 0 20 20"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <title>game_controller_round [#799]</title>
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g strokeWidth="1" fill="none" fillRule="evenodd">
              <g
                transform="translate(-420.000000, -4679.000000)"
                fill="#AFDDE5"
              >
                <g id="icons" transform="translate(56.000000, 160.000000)">
                  <path d="M382,4528 C382,4527.448 381.552,4527 381,4527 L367,4527 C366.448,4527 366,4527.448 366,4528 L366,4536 C366,4536.552 366.448,4537 367,4537 L369,4537 C369.552,4537 370,4536.552 370,4536 C370,4535.448 370.448,4535 371,4535 L377,4535 C377.552,4535 378,4535.448 378,4536 C378,4536.552 378.448,4537 379,4537 L381,4537 C381.552,4537 382,4536.552 382,4536 L382,4528 Z M384,4527 L384,4537 C384,4538.105 383.105,4539 382,4539 L378,4539 C376.895,4539 376,4538.105 376,4537 L372,4537 C372,4538.105 371.105,4539 370,4539 L366,4539 C364.895,4539 364,4538.105 364,4537 L364,4527 C364,4525.895 364.895,4525 366,4525 L373,4525 L373,4523 C373,4521.895 373.895,4521 375,4521 L377,4521 C377.552,4521 378,4520.552 378,4520 L378,4519 L380,4519 L380,4521 C380,4522.105 379.105,4523 378,4523 L376,4523 C375.448,4523 375,4523.448 375,4524 L375,4525 L382,4525 C383.105,4525 384,4525.895 384,4527 L384,4527 Z M379,4529 L377,4529 C376.448,4529 376,4529.448 376,4530 L376,4531 L376,4532 C376,4532.552 376.448,4533 377,4533 L379,4533 C379.552,4533 380,4532.552 380,4532 L380,4531 L380,4530 C380,4529.448 379.552,4529 379,4529 L379,4529 Z M372,4530 L372,4531 L372,4532 C372,4532.552 371.552,4533 371,4533 L369,4533 C368.448,4533 368,4532.552 368,4532 L368,4531 L368,4530 C368,4529.448 368.448,4529 369,4529 L371,4529 C371.552,4529 372,4529.448 372,4530 L372,4530 Z"></path>
                </g>
              </g>
            </g>
          </svg>

          <h1>Gobblet Gobblers</h1>
        </div>

        <div className="infoIconContainer">
          <p
            onClick={() => {
              setShowInfo(!showInfo);
            }}
          >
            Info
          </p>
        </div>
      </header>
      {showInfo ? (
        <div className="infoContainer">
          <div className="info">
            <p>Gobblet is a board game for two players.</p>
            <br />
            <p>
              Your goal is to place three of your pieces in a horizontal,
              vertical or diagonal row.
            </p>
            <br />
            <p>
              The pieces can nest into each other and they start the game off
              the board.
            </p>
            <br />
            <p>
              On a turn, you either play one piece from off-the-board or move
              one piece on the board to any other spot on the board where it
              fits. A larger piece can cover any smaller piece.
            </p>

            <br />
            <p>You can either drag or click on the figures to move them.</p>
            <br />
            <button
              onClick={() => {
                setShowInfo(false);
              }}
            >
              Hide info
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
