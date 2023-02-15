// importing all dependencies. Inluding emoji dependancies

import { useState, useRef, useEffect, Suspense } from "react";
import React from 'react';
import { Container, Button, Form, Card, Col } from "react-bootstrap";
import { countryCodeEmoji} from 'country-code-emoji';
import emojiFlags from "emoji-flags";

// functional component NameChecker
function NameChecker() {
    const [data, setData] = useState(null);
    const form = useRef()
    let name = JSON.parse(sessionStorage.getItem("name"));

// Getting data from for and setting the API link
    function getData(){
        let formAccess = form.current;
        name = formAccess[0].value;
        sessionStorage.setItem("name", JSON.stringify(name));
    }

// Fetch data arrow function
    const fetchData = () => {
        return fetch(`https://api.nationalize.io?name=${name}`)
              .then((response) => response.json())
              .then((data) => setData(data));
      }
// use effect hook to fecth API on button click
    useEffect(() => {
        fetchData();
    },[])

// Display loading when data is being fecthed
    if (data === null) {
        return <h1 style={{margin:"1rem"}}>Loading...</h1>;
    }

    return ( 
        <Container>
        <h1>Name nationality predictor</h1>
        <Form style={{width:"40rem", margin:"auto"}} ref={form} >
            <Form.Group className="mb-3">
                <Form.Label>Enter the name</Form.Label>
                <Form.Control type="text" id="fname" name="fname" autoFocus placeholder="Enter name" />
                <Form.Text className="text-muted">
                    Please enter a name, and predict the nationality of a person given their name.
                </Form.Text>
            </Form.Group>

            <Button onClick={()=> getData()} variant="primary" type="submit">
            Submit
            </Button>
        </Form>
        <Suspense>
            <div style={{padding:"3rem"}}>
            <h1>{name}</h1>
            {data.country.map((item, index) =>
            <Col key={index} index={index} >
                <Card style={{padding:"1rem", width:"20rem", margin:"auto", marginTop:"1rem"}} bg='dark' className="card-deck" >
                    <h2>{[item.country_id].map(countryCodeEmoji)} {[emojiFlags.countryCode(item.country_id)][0].name}</h2>
                    <p className="card-text">{Math.ceil(item.probability*100)}%</p>
                </Card>
            </Col>
            )}
            </div>
        </Suspense>
      </Container>
     );
}

export default NameChecker;

// {`&#${[emojiFlags.countryCode(item.country_id)][0].unicode};`