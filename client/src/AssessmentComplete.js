import React from 'react';
import Cta from "./components/Cta";
import Data from './json/complete.json';

export default function AssessmentComplete() {

  return (

    <div className="template template-home template-complete">

      <div className="container">
        <div className="template-inner">
        <h1 className="template-title">{Data.title}</h1>

          <div className="template-left">
            <div className="te" dangerouslySetInnerHTML={{__html: Data.text}} />
          </div>
          <div className="template-right">

            <div className="ctas">

            {
              Data.ctas.map((cta, i) => (
                <Cta
                  key={i}
                  title={cta.title}
                  text={cta.text}
                  link_title={cta.link_title}
                  link_type={cta.link_type}
                  link_url={cta.link_url}
                  link_icon={cta.link_icon}
                  theme={cta.theme}

                  />
              ))
            }

            </div>

          </div>

        </div>


      </div>

    </div>
  )

}
