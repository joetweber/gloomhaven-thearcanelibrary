import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import GameActions from '../actions/GameActions';
import ErrorActions from '../actions/ErrorActions';

class DropboxChooserComponent extends Component {

  loadFromDropbox() {
    var that = this;

    window.Dropbox.choose({
      success: function(files) {
        that.chosenFromDropbox(files[0]);
      },
      linkType: "direct",
      extensions: ["text"]
    });
  }

  chosenFromDropbox(file) {
    // request the file contents from Dropbox
    fetch(file.link).then(function(response) {
      // read the response body as text
      response.json()
        .then(function(data) {
          // quick check that the text content is actually a save game
          if (data.name && data.partyNotes) {
            // load the game into the browser
            GameActions.loadGame(data);
          }
          else {
            // show an error message indicating that this is not the content that we expected
            throw new Error("missing data");
          }
        })
        .catch(function(error) {
          ErrorActions.showError(error, "Failed to parse file. Please check it is formatted correctly and try again.");
        });
    });
  }

  render() {
    return (
        <div className="">
          { window.Dropbox.isBrowserSupported() && 
          	<Button className="btn-doomstalker" onClick={() => this.loadFromDropbox()}><Glyphicon glyph="cloud-download" /> Load</Button>
          }
        </div>
    );
  }
}

export default DropboxChooserComponent;