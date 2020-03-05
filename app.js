topics = ["dog", "cat", "bird", "frog"];
// still_images = [];
// gif_images = [];
ResArray = [];
TenMoreTimes = 0;
IsTopicClicked = false;
ActiveTopic = "";
offset = 0;
count = 0;
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
    count = 0;
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
          '" data-state="on" data-animate="' +
          ResArray.data[i].images.fixed_height.url +
          '" data-still="' +
          ResArray.data[i].images.fixed_height_still.url +
          '"/></div></div></div><div class="col-md-6"><div class="card"><div class="card-header"><h2>Rating: ' +
          ResArray.data[i + 1].rating.toUpperCase() +
          '</h2></div><div class="card-body"><img class="img-fluid img-thumbnail giphy-img" src="' +
          ResArray.data[i + 1].images.fixed_height.url +
          '" data-state="on"  data-animate="' +
          ResArray.data[i + 1].images.fixed_height.url +
          '" data-still="' +
          ResArray.data[i + 1].images.fixed_height_still.url +
          '"/></div></div></div></div>'
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
          topics.push(newtopic);
          CreateButtons();
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
});
