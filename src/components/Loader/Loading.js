import React from "react";
import { Segment, Dimmer, Loader, Image } from "semantic-ui-react";

import paragraphImage from "../../assets/images/loading-paragraph.png";

function Loading(props) {
  return (
    <Segment>
      <Dimmer active inverted>
        <Loader size="massive">{props.message}</Loader>
      </Dimmer>

      <Image src={paragraphImage} />
      <Image src={paragraphImage} />
      <Image src={paragraphImage} />
      <Image src={paragraphImage} />
      <Image src={paragraphImage} />
      <Image src={paragraphImage} />
    </Segment>
  );
}

export default Loading;
