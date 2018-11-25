$( document ).ready(function() {
    $(".signup-action-btn").click(function(event){
        formId = 'form-create-user';
        if(!validateFormFields(formId)) {
            event.preventDefault();
        }
    });

    $(".login-action-btn").click(function(event){
        formId = 'user-login-user';
        if(!validateFormFields(formId)) {
            event.preventDefault();
        }
    });

    $("button.comment-submit").click(function(event){
        commentText = $(".comment-div-wrapper textarea.comment-area").val();
        restaurantId = $(".retaurant_id").val();
        if(!commentText || commentText === "") {
            $(".comment-div-wrapper textarea.comment-area").addClass("validate-input");
            return false;
        }
        postData = {
            'commenttext' : commentText,
            'restaurantid' : restaurantId
        }
        $.ajax({
            type: 'POST',
            url: '/comment/addcomment',
            data: postData,
            success: function(response) {
                console.log(response);
                if(response.validation) {
                    $('.user-comments').append('<div class="comment-text">"' + response.commenttext + '"</div>');
                    $('.user-comments').append('<div class="username-text">- ' + response.username + '</div>');
                    $(".user-review-section").hide();
                    return false;
                } else {
                    swal({
                        title: "You are not logged in!!",
                        text: "Please login to comment..",
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonClass: 'btn-primary',
                        confirmButtonText: 'OK'
                    });
                }
            },
            error: function(error) {
                console.log("Exception Caught: " + error);
            }
        });
    });

    $(".wishlist-add-wrapper .place-options").click(function(event){
        el = $(this);
        option = $(this).attr('data-action');
        restaurantId = $(this).attr('data-id');
        postData = {
            'restaurantid' : restaurantId
        }
        if(option == "wishlist") {
            if(el.hasClass('added-to-wishlist')) {
                swal({
                    title: "Are you sure?",
                    text: "Do you really wanna remove from your wishlist?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Remove",
                    closeOnConfirm: false
                  },
                  function(){
                    $.ajax({
                        type: 'POST',
                        url: '/user/removefromwishlist',
                        data: postData,
                        success: function(response) {
                            console.log(response);
                            console.log(response.validation);
                            if(response.validation) {
                                swal("Removed!", "The restaurant is removed from your wishlist", "success");
                                el.removeClass("added-to-wishlist");
                                console.log(response);
                            } else {
                               swal({
                                    title: "You are not logged in!",
                                    text: "Please login to add to wishlist..",
                                    type: "warning",
                                    showCancelButton: false,
                                    confirmButtonClass: 'btn-primary',
                                    confirmButtonText: 'OK'
                                }); 
                            }
                        },
                        error: function(error) {
                            console.log("Exception Caught: " + error);
                        }
                    });
                  });
            } else {
                $.ajax({
                    type: 'POST',
                    url: '/user/addtowishlist',
                    data: postData,
                    success: function(response) {
                        console.log(response);
                        console.log(response.validation);
                        if(response.validation) {
                            el.addClass("added-to-wishlist");
                        } else {
                           swal({
                                title: "You are not logged in!",
                                text: "Please login to add to wishlist..",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonClass: 'btn-primary',
                                confirmButtonText: 'OK'
                            }); 
                        }
                    },
                    error: function(error) {
                        console.log("Exception Caught: " + error);
                    }
                });
            }
        } else {
            if(el.hasClass('upvoted')) {
                postData.vote = false;
            } else {
                postData.vote = true;
            }
            console.log(postData);
            $.ajax({
                type: 'POST',
                url: '/restaurant/vote',
                data: postData,
                success: function(response) {
                    console.log(response);
                    console.log(response.validation);
                    if(response.validation) {
                        if(postData.vote) {
                            el.addClass("upvoted");
                        } else {
                            el.removeClass("upvoted");
                        }
                    } else {
                       swal({
                            title: "You are not logged in!",
                            text: "Please login to post your vote",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonClass: 'btn-primary',
                            confirmButtonText: 'OK'
                        }); 
                    }
                },
                error: function(error) {
                    console.log("Exception Caught: " + error);
                }
            });
        }
    });


});

function validateFormFields(formId) {
    validation = true;
    $( "#"+ formId +" input" ).each(function() {
        if(!$(this).val()) {
            validation = false;
            $(this).addClass("validate-input");
        }
    });
    return validation;
}