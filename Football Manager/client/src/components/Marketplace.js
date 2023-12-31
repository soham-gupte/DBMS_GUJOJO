import Axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { BrowserRouter, Router } from 'react-router-dom';
import { IoCloudDownload } from "react-icons/io5";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Input } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';

function Items({ currentItems, handleEditClick }) {
    return (
      <>
        {currentItems &&
          currentItems.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.player_name}</td>
              <td>{item.position}</td>
              <td>{item.nationality}</td>
              <td>{item.value}</td>
              <td>
                <a href="/main" className="edit" title="Edit" data-toggle="tooltip" onClick={() => handleEditClick(item.player_name)}><IoCloudDownload /></a>
              </td>
            </tr>
          ))}
      </>
    );
  }
  

export function Marketplace({ itemsPerPage }) {

    const [searchTerm, setSearchTerm] = useState('');

    const [team_name, setTeamName] = useState('');
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState("");

    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
    const navigate = useNavigate();  // Initialize useNavigate

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    const currentItems = players.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(players.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % players.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    const handleEditClick = (player_name) => {
        Axios.post('http://localhost:3001/buyplayer', {
          team_name: team_name,
          playerName: player_name,
        })
        .then((response) => {
          console.log("SUCCESS");
        
        })
        .catch((error) => {
            console.log("Error : ", error);
        });
}

    useEffect(() => {
        const storedTeamName = localStorage.getItem('team_name');

        // Update state with the retrieved username
        if (storedTeamName) {
            setTeamName(storedTeamName);
        }

        Axios.post('http://localhost:3001/retreivemarketplace', {   
            team_name: team_name,
            search_term: searchTerm,
        }).then((response) => {
            console.log("Marketplace retrieved successfully !");
            // Ensure response.data.player_name is defined before setting it in the state
            if (response.data.player_name) {
                // Assuming all arrays have the same length and are synchronized
                const newPlayers = response.data.player_name.map((name, index) => ({
                    player_name: name,
                    position: response.data.position[index],
                    nationality: response.data.nationality[index],
                    value: response.data.value[index]
                }));
                setPlayers(newPlayers);
            }
        }).catch((error) => {
            console.log("Some error occurred :(");
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [team_name, searchTerm]);

    return (

        <div class="container ">
            <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded">
                <div class="row ">
                    <div class="col-sm-3 mt-5 mb-4 text-gred">
                        <div className="search">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" placeholder="Search Player" aria-label="Search" value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} />
                            </form>
                        </div>
                    </div>
                    <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{ color: "green" }}><h2><b>Marketplace</b></h2></div>

                </div>
                <div class="row">
                    <div class="table-responsive " >
                        <table class="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name </th>
                                    <th>Position</th>
                                    <th>Nationality </th>
                                    <th>Value </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <Items currentItems={currentItems} handleEditClick={handleEditClick} />
                            </tbody>
                        </table>
                        <ReactPaginate
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={'...'}
                            pageCount={pageCount}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination justify-content-center'}
                            pageClassname={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(
    <BrowserRouter>
      <Marketplace itemsPerPage={20} />
    </BrowserRouter>,
    document.getElementById('root')
  );