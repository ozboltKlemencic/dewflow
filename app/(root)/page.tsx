import Link from "next/link";
import React from "react";

import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const questions = [
  {
    _id: "1",
    title: "react",
    description: "fsdfdsfs",
    tags: [
      { _id: "1", name: "react" },
      { _id: "1", name: "react" },
    ],
    author: "niga",
    upVotes: 45645,
    answears: 63465,
    views: 234,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "js",
    description: "fsdffdsfs",
    tags: [
      { _id: "1", name: "react" },
      { _id: "1", name: "react" },
    ],
    author: "niga",
    upVotes: 45645,
    answears: 63465,
    views: 234,
    createdAt: new Date(),
  },
];

const Home = async ({ searchParams }: SearchParams) => {
  const { query = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(query?.toLowerCase())
  );
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Questions</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search Questions..."
          otherClasses="flex-1"
        />
      </section>
      {/* HomeFilter */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <h1 key={question._id}>{question.title}</h1>
        ))}
      </div>
    </>
  );
};

export default Home;
