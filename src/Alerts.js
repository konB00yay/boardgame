export const PICK_POKEMON = options => {
  return {
    title: "Pick a Pokemon!",
    position: "top",
    input: "select",
    inputOptions: options,
    allowOutsideClick: false,
    inputPlaceholder: "",
    showCancelButton: false,
    confirmButtonColor: "rgb(208,33,41)",
    confirmButtonText: "OK",
    width: 275,
    padding: "0.7em",
    customClass: {
      heightAuto: false,
      popup: "popup-class",
      confirmButton: "join-button-class",
      cancelButton: "join-button-class"
    }
  };
};

export const DISCONNECTED_LEADER = {
  title: "Disconnected from timeout!",
  width: 275,
  position: "center",
  allowOutsideClick: false,
  padding: "0.7em",
  confirmButtonText: "Make new room? (Same spaces)"
}

export const DISCONNECTED_PLAYER = {
  position: "top",
  input: "text",
  title: "Someone disconnected, have the leader make a new room",
  allowOutsideClick: false,
  inputPlaceholder: "Enter the room id",
  showCancelButton: true,
  confirmButtonColor: "rgb(208,33,41)",
  confirmButtonText: "OK",
  width: 275,
  padding: "0.7em",
  customClass: {
    heightAuto: false,
    popup: "popup-class",
    confirmButton: "join-button-class",
    cancelButton: "join-button-class"
  }
}

export const PLAYER_WINS = player => {
  return {
    title: "Player " + player + " Wins!",
    width: 275,
    position: "center",
    allowOutsideClick: false,
    padding: "0.7em",
    backdrop: "rgba(0,0,123,0.4)",
    confirmButtonText: "New Game?"
  };
};

export const NOT_ENOUGH_PLAYERS = {
  title: "Not Enough Players",
  text: "Delete game or invite more friends?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Invite More",
  cancelButtonText: "Delete Game",
  reverseButtons: true
};

export const PIKACHU = {
  title: "Choose Pikachu?",
  text: "Replace current starter with Pikachu",
  showCancelButton: "false",
  confirmButtonText: "Pika Pika",
  cancelButtonText: "Nah Fam",
  allowEscapeKey: false,
  allowEnterKey: false,
  allowOutsideClick: false
};

export const EVOLVE = {
  title: "Evolve?",
  text: "Evolve and skip next gym",
  showCancelButton: "false",
  confirmButtonText: "Evolve!",
  cancelButtonText: "lol Everstone",
  allowEscapeKey: false,
  allowEnterKey: false,
  allowOutsideClick: false
};

export const DELETED = {
  title: "Deleted",
  text: "Your room has been deleted",
  icon: "error",
  timer: 1500
};

export const SHARE_WITH_FRIENDS = room => {
  return {
    position: "top",
    allowOutsideClick: false,
    title: "Share this room ID with your friends",
    text: room,
    footer: "Waiting for Player 2 to join...",
    showConfirmButton: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    width: 275,
    padding: "0.7em",
    customClass: {
      heightAuto: false,
      title: "title-class",
      popup: "popup-class",
      confirmButton: "button-class"
    }
  };
};

export const JOIN = {
  position: "top",
  input: "text",
  allowOutsideClick: false,
  inputPlaceholder: "Enter the room id",
  showCancelButton: true,
  confirmButtonColor: "rgb(208,33,41)",
  confirmButtonText: "OK",
  width: 275,
  padding: "0.7em",
  customClass: {
    heightAuto: false,
    popup: "popup-class",
    confirmButton: "join-button-class",
    cancelButton: "join-button-class"
  }
};

export const NONEXISTENT_ROOM = {
  title: "Room does not exist",
  text: "Create a game room to invite friends!",
  position: "top",
  icon: "error",
  allowOutsideClick: false,
  confirmButtonColor: "rgb(208,33,41)",
  confirmButtonText: "OK",
  timer: 3000,
  width: 275,
  padding: "0.7em",
  customClass: {
    heightAuto: false,
    popup: "popup-class",
    confirmButton: "join-button-class",
    cancelButton: "join-button-class"
  }
};
