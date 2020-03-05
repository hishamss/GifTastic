var topics = ["dog", "cat", "bird", "frog"];
var still_images = [];
var gif_images = [];
$(document).ready(function() {
  $(".images").hide();
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
    console.log("topic fired");
    still_images = [];
    gif_images = [];
    $(".images").hide();
    var queryURL =
      "https://api.giphy.com/v1/gifs/search?api_key=4Oz89PXB8NoqCXfKwzRoFETCFIhc9bLQ&q=" +
      $(this).text() +
      "&limit=10";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      for (i = 0; i < response.data.length; i++) {
        $("#" + i).attr("src", response.data[i].images.fixed_height.url);
        $("#h" + i).html("<h2>Rating: " + response.data[i].rating + "</h2>");
        gif_images.push(response.data[i].images.fixed_height.url);

        still_images.push(response.data[i].images.fixed_height_still.url);
      }
    });
    setTimeout(function() {
      $(".images").show();
    }, 300);
  });
  $(".giphy-img").on("click", function(e) {
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
});
