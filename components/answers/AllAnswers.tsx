import React from "react";
import DataRenderer from "../DataRenderer";
import { error } from "console";
import { EMPTY_ANSWERS } from "@/constants/states";
import AnswerCard from "../cards/AnswerCard";

interface Props extends ActionResponse<Answear[]> {
  totalAnswers: number;
}

const AllAnswers = ({ data, success, error, totalAnswers }: Props) => {
  return (
    <div className="mt-11 ">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers == 1 ? "Answer" : "Answers"}
        </h3>
        <p>Filters</p>
      </div>

      <DataRenderer
        data={data}
        error={error}
        success={success}
        empty={EMPTY_ANSWERS}
        render={(answers) =>
          answers.map((answer) => (
            <AnswerCard
              author={answer.author}
              content={answer.content}
              key={answer._id}
              createdAt={answer.createdAt}
              _id={answer.author._id}
            />
          ))
        }
      />
    </div>
  );
};

export default AllAnswers;
