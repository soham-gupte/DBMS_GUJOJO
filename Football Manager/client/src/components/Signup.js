import { useState } from "react";
import Axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import '../styles/SignupStyles.css';
import { Button } from "react-bootstrap";

export function Signup() {
    const [team_name, setteam_name] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const addTeam = () => {
        Axios.post('http://localhost:3001/create', {
            team_name: team_name,
            password: password,
            email: email,
        }).then((response) => {
            console.log("SUCCESS");
            if (response.data && response.data.data === "Values Inserted") {
                // Team created successfully
                localStorage.setItem('team_name', team_name);
                console.log("GOING TO MAIN PAGE");
                navigate('/main');
            } else {
                // Display error message if team_name already exists
                setError("Team with that team name already exists. Please choose another team name.");
            }
        })
            .catch((error) => {
                console.log("Error during signup:", error);
                console.log(error.response.data)
                if (error.response.data.data === "Team name already exists") {
                    setError("Team name already exists. Use a different team name");
                    // setError("Team name already exists. Use a different team name");
                } else {
                    setError("Error during signup");
                }
            });
    }

    return (
        <div className="SignUpPage">
            <div className="signup-box">
               <h4>Team Name :</h4>
                <input type="text" onChange={(event) => setteam_name(event.target.value)} />
               <h4>Password :</h4>
                <input type="password" onChange={(event) => setPassword(event.target.value)} />
               <h4>Email ID :</h4>
                <input type="text" onChange={(event) => setEmail(event.target.value)} />
                <hr></hr>
                <Button onClick={addTeam}>Signup</Button>

                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
        </div>
    );
}