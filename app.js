topics = ["dog", "cat", "bird", "frog"];
ResArray = [];
favorite = [];
TenMoreTimes = 0;
IsTopicClicked = false;
ActiveTopic = "";
offset = 0;
count = 0;
$(document).ready(function() {
  $("#AddMovie").val("");
  // get the favorites from localstorge on page load
  favorite = JSON.parse(localStorage.getItem("favorite"));
  // if localstorage is empty
  if (!Array.isArray(favorite)) {
    favorite = [];
    $("#FavCount").text(0);
  } else {
    $("#FavCount").text(favorite.length);
  }
  // this will remove myfavorite header if my favorite button not clicked
  $(".images").parent()[0].children[0].innerHTML = "";
  CreateButtons();

  function CreateButtons() {
    $(".main").empty();
    for (topic of topics) {
      $(".main").append(
        '<button class="btn btn-lg btn-success topic">' + topic + "</button>"
      );
    }
  }
  $(document).on("click", ".topic", function() {
    offset = 0;
    count = 0;
    IsTopicClicked = true;
    ActiveTopic = $(this).text();
    ApiRequest($(this).text(), offset);
    $(".images").parent()[0].children[0].innerHTML = "";
  });
  function DisplayImages() {
    for (i = 0; i < ResArray.data.length; i++) {
      if (i > 0 && i % 2 == 0) {
        $(".images").append('<div class="w-100"></div>');
      }
      $(".images").append(
        '<div class="col"><div class="card"><div class="card-header"><h2 class="h_head">Rating: ' +
          ResArray.data[i].rating.toUpperCase() +
          '</h2><button type="button" class="btn btn-secondary btn-sm favorites" data-toggle="tooltip" data-placement="top" title="Add to My Favorite"><i class="fas fa-heart"></i></button></div><div class="card-body"><h4>' +
          ResArray.data[i].title.toUpperCase() +
          '</h4><img class="img-fluid img-thumbnail giphy-img" src="' +
          ResArray.data[i].images.fixed_height.url +
          '" data-state="on" data-animate="' +
          ResArray.data[i].images.fixed_height.url +
          '" data-still="' +
          ResArray.data[i].images.fixed_height_still.url +
          '"/></div></div></div>'
      );
    }
  }

  $(document).on("click", ".giphy-img", function() {
    if ($(this).attr("data-state") === "on") {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "off");
    } else {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "on");
    }
  });
  $("#SubBtn").on("click", function(event) {
    event.preventDefault();
    var newtopic = $("#AddMovie").val();
    if (newtopic !== "") {
      var queryURL =
        "https://api.giphy.com/v1/gifs/search?api_key=4Oz89PXB8NoqCXfKwzRoFETCFIhc9bLQ&q=" +
        $("#AddMovie").val();
      +"&limit=1";

      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        if (response.data.length !== 0) {
          if (!topics.includes(newtopic)) {
            topics.push(newtopic);
            console.log(topics);
            CreateButtons();
          } else {
            alert("This Button Already Exists!");
          }
        } else {
          alert("Not Valid Topic");
        }
      });
    } else {
      alert("Pleaes type the name of the topic");
    }
    // clear AddMovie text after we done
    $("#AddMovie").val("");
  });
  $("#TenMore").on("click", function() {
    if (IsTopicClicked) {
      offset = offset + 10;
      ApiRequest(ActiveTopic, offset);
      $(".images").append('<div class="w-100"></div>');
    } else {
      alert("No GIFs to Add");
    }
  });
  function ApiRequest(topic, offs) {
    $(".images").hide();
    if (offs == 0) {
      still_images = [];
      gif_images = [];
      $(".images").text("");
    }

    var queryURL =
      "https://api.giphy.com/v1/gifs/search?api_key=4Oz89PXB8NoqCXfKwzRoFETCFIhc9bLQ&q=" +
      topic +
      "&offset=" +
      offs +
      "&limit=10";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      ResArray = response;
      DisplayImages();
      $(".images").show();
    });
  }

  $(document).on("click", ".favorites", function() {
    var temp = [];
    temp.push($(this).parent()[0].children[0].innerHTML);
    temp.push($(this).parent()[0].nextElementSibling.children[0].innerHTML);
    temp.push($(this).parent()[0].nextElementSibling.children[1].outerHTML);
    // to check if the gif is already in the favorites
    if (!JSON.stringify(favorite).includes(JSON.stringify(temp))) {
      favorite.push(temp);
    }

    $("#FavCount").text(favorite.length);
    localStorage.setItem("favorite", JSON.stringify(favorite));
    $(this).css("color", "#fc6666");
  });
  $("#myfav").on("click", function() {
    IsTopicClicked = false;
    $(".images").parent()[0].children[0].innerHTML = "My Favorites";
    $(".images").text("");
    favorite = JSON.parse(localStorage.getItem("favorite"));
    console.log(favorite);
    // When the localstorage is empty, favorite will be null/ not array>> favorite.length will return
    // error. the follwoing if to assign empty array in case it's null
    if (!Array.isArray(favorite)) {
      favorite = [];
    }
    for (i = 0; i < favorite.length; i++) {
      if (i > 0 && i % 2 == 0) {
        $(".images").append('<div class="w-100"></div>');
      }
      $(".images").append(
        '<div class="col"><div class="card"><div class="card-header"><h2>' +
          favorite[i][0] +
          '</h2></div><div class="card-body"><h4>' +
          favorite[i][1] +
          "</h4>" +
          favorite[i][2] +
          "</div></div></div>"
      );
    }
  });
  $("#Clearmyfav").on("click", function() {
    localStorage.clear();
    favorite = [];
    $("#FavCount").text(favorite.length);
    $(".images").text("");
  });
});
