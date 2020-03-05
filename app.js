topics = ["dog", "cat", "bird", "frog"];
still_images = [];
gif_images = [];
ResArray = [];
TenMoreTimes = 0;
IsTopicClicked = false;
ActiveTopic = "";
offset = 0;
$(document).ready(function() {
  // $(".images").hide();
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
    IsTopicClicked = true;
    ActiveTopic = $(this).text();
    ApiRequest($(this).text(), offset);
  });
  function DisplayImages() {
    for (i = 0; i < ResArray.data.length; i = i + 2) {
      $(".images").append(
        '<div class="row"><div class="col-md-6"><div class="card"><div class="card-header"><h2>Rating: ' +
          ResArray.data[i].rating.toUpperCase() +
          '</h2></div><div class="card-body"><img class="img-fluid img-thumbnail giphy-img" src="' +
          ResArray.data[i].images.fixed_height.url +
          '" data-state="on" id="' +
          i +
          '"/></div></div></div><div class="col-md-6"><div class="card"><div class="card-header"><h2>Rating: ' +
          ResArray.data[i + 1].rating.toUpperCase() +
          '</h2></div><div class="card-body"><img class="img-fluid img-thumbnail giphy-img" src="' +
          ResArray.data[i + 1].images.fixed_height.url +
          '" data-state="on" id="' +
          parseInt(i + 1) +
          '"/></div></div></div></div>'
      );
      gif_images.push(ResArray.data[i].images.fixed_height.url);

      still_images.push(ResArray.data[i].images.fixed_height_still.url);
      gif_images.push(ResArray.data[i + 1].images.fixed_height.url);

      still_images.push(ResArray.data[i + 1].images.fixed_height_still.url);
    }
    // setTimeout(function() {
    //   $(".images").show();
    // }, 300);
  }

  $(document).on("click", ".giphy-img", function() {
    if ($(this).attr("data-state") === "on") {
      $(this).attr("src", still_images[$(this).attr("id")]);
      $(this).attr("data-state", "off");
    } else {
      $(this).attr("src", gif_images[$(this).attr("id")]);
      $(this).attr("data-state", "on");
    }
  });
  $("#SubBtn").on("click", function(event) {
    event.preventDefault();
    var newtopic = $("#AddMovie").val();
    topics.push(newtopic);
    CreateButtons();
  });
  $("#TenMore").on("click", function() {
    if (IsTopicClicked) {
      offset = offset + 10;
      ApiRequest(ActiveTopic, offset);
    } else {
      alert("No GIFs to Add");
    }
  });
  function ApiRequest(topic, offs) {
    still_images = [];
    gif_images = [];
    $(".images").hide();
    if (offs == 0) {
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
});
