var topics = ["dog", "cat", "bird", "frog"];
var still_images = [];
var gif_images = [];
$(document).ready(function() {
  $(".images").hide();
  CreateButtons();
  function CreateButtons() {
    for (topic of topics) {
      $(".main").append(
        '<button class="btn btn-lg btn-success topic">' + topic + "</button>"
      );
    }
  }
  $(".topic").click(function() {
    still_images = [];
    gif_images = [];
    $(".images").hide();
    var queryURL =
      "https://api.giphy.com/v1/gifs/search?api_key=4Oz89PXB8NoqCXfKwzRoFETCFIhc9bLQ&q=" +
      $(this).text() +
      "&limit=10";
    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      for (i = 0; i < response.data.length; i++) {
        $("#" + i).attr("src", response.data[i].images.original.url);
        gif_images.push(response.data[i].images.original.url);

        still_images.push(response.data[i].images.downsized_still.url);
      }
    });
    setTimeout(function() {
      $(".images").show();
    }, 300);
  });
  $(".giphy-img").click(function(e) {
    if ($(this).attr("state") === "on") {
      $(this).attr("src", still_images[$(this).attr("id")]);
      $(this).attr("state", "off");
    } else if ($(this).attr("state") === "off") {
      $(this).attr("src", gif_images[$(this).attr("id")]);
      $(this).attr("state", "on");
    }
  });
});
