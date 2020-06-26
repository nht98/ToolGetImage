const request = require ('request');
var fs = require('fs');
var _ = require('lodash');
const { get } = require('request');

var getAllPhoto = (idFB) => {
    fs.readFile("value/session.json", (err, data) => {
        var dataParsed = JSON.parse(data)
        token = dataParsed.Token;
    getImage = {
        url: 'https://graph.facebook.com/v1.0/'+idFB+'/feed?fields=full_picture&limit=1000&access_token='+token,
        method: 'GET',
    }
    fs.stat(`value/${idFB}-fb.html`, function (err, stat) {
        if (err == null) {
            fs.unlink(`value/${idFB}-fb.html`, (err) => {
                if (err) throw err;
            })
        }                        
    })
    getImages(getImage);
    function getImages(getImage){
        request(getImage, function (error, response, body ) {
            if (!error && response.statusCode == 200) {
                var parsedData = JSON.parse(body);
                var arrayData = parsedData.data;
                arrayData.forEach(function(index){
                    var imageLink = index.full_picture;
                    if(imageLink != undefined){
                        fs.appendFile(`value/${idFB}-fb.html`, `\n<img src="${imageLink}" style=" width: 270px;height: 280px;float: left;margin-left: 70px;margin-top: 20px;margin-bottom: 60px;position: relative;">`, (err) => {  
                            if (err){

                            }
                        })
                    }
                });
                try{
                    if(parsedData.paging.next != null){
                        var linkNext = parsedData.paging.next;
                        getImage = {
                            url: linkNext,
                            method: 'GET',
                        }
                        getImages (getImage);
                    }
                }catch(err){

                }
            }
            if (response.statusCode == 429) {
                console.log("You have reach limit of REQUESTS\nTry again next hour");
            }
        }
        )
    }
})  
}

module.exports.getAllPhoto = getAllPhoto;