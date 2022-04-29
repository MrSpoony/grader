import React from "react";
import { Row, Col } from "react-bootstrap";
import Loading from "./Loading";

export default function SampleCases({ sampleCases }) {
    if (!SampleCases) return <Loading/>;
    return (
        <> 
            <h4 className="my-4">Samples:</h4>
            {
                sampleCases.map((sc, i) => {
                    return (
                        <div key={sc.id} >
                            <h5>Sample.{String(i).padStart(2, "0")}</h5>
                            <Row className="mb-4">
                                <Col className="border">
                                    <h6 className="mt-3">
                                                    Input:
                                    </h6>
                                    <pre>
                                        {sc.input}
                                    </pre>
                                </Col>
                                <Col className="border">
                                    <h6 className="mt-3">
                                                    Output:
                                    </h6>
                                    <pre>
                                        {sc.output}
                                    </pre>
                                </Col>
                            </Row>
                        </div>
                    );
                })
            }
        </>
    );
}
