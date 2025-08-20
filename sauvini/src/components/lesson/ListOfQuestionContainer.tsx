"use state";

import { Check, ChevronLeft, CircleQuestionMark } from "lucide-react";
import QACard from "./QACard";
import { useState } from "react";

// list of question fetched from the db

const questions = [
  {
    id: 1,
    question_tite: "Question Title",
    question_description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum ...",
    question_attachement: "url goes here",
    answer_details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum ...",
    anwser_attachement: "url goes here",
  },
  {
    id: 2,
    question_tite: "Question Title",
    question_description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum ...",
    question_attachement: "url goes here",
    answer_details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum ...",
    anwser_attachement: "url goes here",
  },
  {
    id: 3,
    question_tite: "Question Title",
    question_description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum ...",
    question_attachement: "url goes here",
    answer_details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum ...",
    anwser_attachement: "url goes here",
  },
  {
    id: 4,
    question_tite: "Question Title",
    question_description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum ...",
    question_attachement: "url goes here",
    answer_details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum ...",
    anwser_attachement: "url goes here",
  },
];

export default function ListOfQuestionContainer() {
  const [showQuestionAsnwer, setShowQuestionAsnwer] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const handleSelectQuestion = (index: number) => {
    if (!showQuestionAsnwer) {
      setSelectedQuestion(index);
      setShowQuestionAsnwer(true);
    }
  };

  const handleCancelSelectQuestion = () => {
    setShowQuestionAsnwer(false);
    setSelectedQuestion(0);
  };

  return (
    <div className="flex flex-col gap-2">
      {showQuestionAsnwer ? (
        <div className="flex flex-col gap-2">
          <QACard
            title={"Question Title"}
            description={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum?"
            }
            icon_type={"button"}
            icon={<ChevronLeft />}
            onClick={() => {
              handleCancelSelectQuestion();
            }}
            attachment={questions[selectedQuestion].question_attachement}
          />
          <QACard
            title={"Anwser Title"}
            description={questions[selectedQuestion].answer_details}
            icon_type={"icon"}
            icon={<Check width={15} height={15} />}
            onClick={() => {}}
            attachment={questions[selectedQuestion].anwser_attachement}
          />
        </div>
      ) : (
        <div className="flex lg:flex-col md:flex-row flex-col gap-2">
          {questions.map((question, index) => {
            return (
              <QACard
                key={index}
                title={question.question_tite}
                description={question.question_description}
                icon_type={"icon"}
                icon={<CircleQuestionMark width={15} height={15} />}
                attachment={question.question_attachement}
                onClick={() => {
                  handleSelectQuestion(index);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
{
  /* <QACard
        title={"Question Title"}
        description={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum"
        }
        icon_type="icon"
        icon={<CircleQuestionMark width={15} height={15} />}
        attachment={undefined}
      /> */
}
