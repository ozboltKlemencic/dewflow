import React from "react";

import { auth } from "@/auth";

const Home = async () => {
  const session = await auth();
  console.log(session);
  return (
    <>
      <h1 className="h1-bold">Home</h1>
    </>
  );
};

export default Home;
