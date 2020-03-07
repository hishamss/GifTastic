topics = ["dog", "cat", "bird", "frog"];
// still_images = [];
// gif_images = [];
ResArray = [];
favorite = [];
TenMoreTimes = 0;
IsTopicClicked = false;
ActiveTopic = "";
offset = 0;
count = 0;
$(document).ready(function() {
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
        '<div class="col"><div class="card"><div class="card-header"><h2>Rating: ' +
          ResArray.data[i].rating.toUpperCase() +
          '</h2><button type="button" class="btn btn-secondary btn-sm favorites">Add To My Favorites</button></div><div class="card-body"><h4>' +
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
    if ($("#AddMovie").val() !== "") {
      var queryURL =
        "https://api.giphy.com/v1/gifs/search?api_key=4Oz89PXB8NoqCXfKwzRoFETCFIhc9bLQ&q=" +
        $("#AddMovie").val();
      +"&limit=1";

      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        if (response.data.length !== 0) {
          var newtopic = $("#AddMovie").val();
          if (!topics.includes(newtopic)) {
            topics.push(newtopic);
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
      console.log(response);
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
    console.log(temp);
    favorite.push(temp);
    localStorage.setItem("favorite", JSON.stringify(favorite));
    console.log(favorite);
  });
  $("#myfav").on("click", function() {
    IsTopicClicked = false;
    $(".images").parent()[0].children[0].innerHTML = "My Favorites";
    $(".images").text("");
    favorite = JSON.parse(localStorage.getItem("favorite"));
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
    $(".images").text("");
    alert("My Favorites has been cleared!");
  });
});
