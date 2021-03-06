const request = require ('request');
var fs = require('fs');
var _ = require('lodash');
const { get } = require('request');
var check;
var options;
var dataOJ={};

var getAllPhoto = (username) => {
fs.readFile("value/session.json", (err, data) => {

    if (err) {
        console.log(err)
    }
    var dataParsed = JSON.parse(data)
    var headers = {
        'referer': 'https://www.instagram.com/',
        'origin' : 'https://www.instagram.com',
        'x-instagram-ajax' : '1',
        'x-requested-with' : 'XMLHttpRequest',
        'x-csrftoken' : dataParsed.CSRF,
        cookie :' sessionid='+dataParsed.SessionID+'; csrftoken='+dataParsed.CSRF
    }

    getIDO = {
        url: 'https://www.instagram.com/'+username+'/?__a=1',
        method: 'GET',
        headers: headers,
    }
    request(getIDO, function (error, response, body ) {
        if (!error && response.statusCode == 200) {
            var parsedData = JSON.parse(body);
            var userID = parsedData.graphql.user.id;
            getImage = {
                url: 'https://www.instagram.com/graphql/query/?query_hash=eddbde960fed6bde675388aac39a3657&variables={"id":"'+userID+'","first":50}',
                method: 'GET',
                headers: headers,
            };
            console.log(getImage);
            fs.stat(`value/${username}-all-image.html`, function (err) {
                if (err == null) {
                    fs.unlink(`value/${username}-all-image.html`, (err) => {
                        if (err) throw err;
                    })
                }                        
            })
            getImages(headers,getImage,userID);
        }
    });
});
function getImages(headers,getImage,userID){
    console.log(getImage);
    request(getImage, function (error, response, body ) {
        if (!error && response.statusCode == 200) {
            var parsedData = JSON.parse(body);
            var arrayData = parsedData.data.user.edge_owner_to_timeline_media.edges;
            arrayData.forEach(function(index){
                if (index.node.__typename == "GraphImage") {
                    var imageLink = index.node.display_url;
                    fs.appendFile(`value/${username}-all-image.html`, `\n<img src="${imageLink}" style=" width: 270px;height: 280px;float: left;margin-left: 70px;margin-top: 20px;margin-bottom: 60px;position: relative;">`, (err) => {  
                        if (err) throw err;
                    })
                }
                if(index.node.is_video == true){
                    var videoLink = index.node.video_url;
                    fs.appendFile(`value/${username}-all-image.html`, `\n<video controls style="width: 270px;height: 280px;float: left;margin-left: 70px;margin-top: 20px;margin-bottom: 60px;position: relative;"> <source src=${videoLink} type="video/mp4"> </video>`, (err) => {  
                        if (err) throw err;
                    })
                }
                if(index.node.__typename == "GraphSidecar"){
                    var arraySlidecar = index.node.edge_sidecar_to_children.edges;
                    arraySlidecar.forEach(function(data){
                        if (data.node.__typename == "GraphImage") {
                            var imageLink = data.node.display_url;
                            fs.appendFile(`value/${username}-all-image.html`, `\n<img src="${imageLink}" style=" width: 270px;height: 280px;float: left;margin-left: 70px;margin-top: 20px;margin-bottom: 60px;position: relative;">`, (err) => {  
                                if (err) throw err;
                            })
                        }
                        if(data.node.is_video == true){
                            var videoLink = data.node.video_url;
                            fs.appendFile(`value/${username}-all-image.html`, `\n<video controls style="width: 270px;height: 280px;float: left;margin-left: 70px;margin-top: 20px;margin-bottom: 60px;position: relative;"> <source src=${videoLink} type="video/mp4"> </video>`, (err) => {  
                                if (err) throw err;
                            })
                        }
                    });
                }
            });
            if(parsedData.data.user.edge_owner_to_timeline_media.page_info.has_next_page == true){
                var end_cursor = parsedData.data.user.edge_owner_to_timeline_media.page_info.end_cursor;
                getImage = {
                    url: 'https://www.instagram.com/graphql/query/?query_hash=eddbde960fed6bde675388aac39a3657&variables={"id":"'+userID+'","first":50,"after":"' + end_cursor + '"}',
                    method: 'GET',
                    headers: headers,
                }
                getImages (headers,getImage,userID);
            }
        }
        try{
            if (response.statusCode == 429) {
                console.log("You have reach limit of REQUESTS\nTry again next hour");
            }
        }catch(err){

        }
    }
    )
} 
}

module.exports.getAllPhoto = getAllPhoto;