import React from "react";
import { Helmet } from "react-helmet";

interface HeadProps {
  name: string;
  description: string;
}

const Head = ({ name, description }: HeadProps) => (
  <Helmet>
    <title>
      {name
        ? `${name} - Zwift Workout Editor`
        : "My Workout - Zwift Workout Editor"}
    </title>
    <meta name="description" content={description} />
    <meta
      property="og:title"
      content={
        name
          ? `${name} - Zwift Workout Editor`
          : "My Workout - Zwift Workout Editor"
      }
    />
    <meta property="og:description" content={description} />
  </Helmet>
);

export default Head;
