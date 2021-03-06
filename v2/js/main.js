// This function will make the specified marker bounce
function shortAnimation(thisMarker) {
    thisMarker.setAnimation(google.maps.Animation.BOUNCE);

    // markers times out after allotted time and animation is set to null
    setTimeout(function () {
        thisMarker.setAnimation(null);
    }, 500);
}

function populatesecondInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker.position != marker.position) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.setMarker = null;
        });
    }
}
// 
function populateInfoWindow(marker, infowindow) {
    
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        
        async function getWiki() {
            var url = `./js/json/wiki-content.json`;
            var headers = new Headers();
            
            headers.append("Content-Type", "application/jsosn; charset=utf-8");
            let response = await fetch(url, {
                headers: headers,
                method: "GET"
            })

            let data = await response.json();
            return data;
        }

        getWiki().then(response => {

                let content = response[marker.wikiTitle];
                const description = content[2].content.replace(/'/g, "\\'");
                

                console.log(description)

                console.log(marker)


                infowindow.setContent(`<div class="color-000"><b>${content[1].content}</b></div><div class="color-000">${marker.address}</div><div class='color-000'><br>${content[2].content} <a href="${content[3].content}" target='_blank'><p><a class='rightSideClick' onclick="rightSide('${marker.id}', '${description}')">open</a></p><img src='img/external.gif' alt='to wikipedia' class='external-img'></img></a></div>`);
            }).catch(err => {
                console.log(err)

                infowindow.setContent(`<div class="color-000"><b>${marker.title}</b></div><div class="color-000">${marker.address}</div><div class='color-000'><br>\nCould not load Wikipedia content.</div>`)
            });
        
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
    }
}

// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}


function contentUpdate() {
    
    const searchTerm = document.getElementById('filter').value.toLowerCase();

    const myDivider = document.getElementById("myDiv");
    let children = myDivider.childNodes;

    const refresh = document.getElementById("refresh");
    let count = 0;

    let value;


    if (searchTerm === '') {

        count = 9999;
        
        for (let i = children.length - 1; i >= 0; i--) {
            markers[i].setMap(map);
            children[i].style.display = 'block';
        };

    } else {

        for (let i = children.length - 1; i >= 0; i--) {

            if (markers[i].title.toLowerCase().indexOf(searchTerm) > -1) {

                markers[i].setMap(map);
                children[i].style.display = 'block';
                count++;
                value = i;

            } else {
                markers[i].setMap(null);
                children[i].style.display = 'none';
            }

        }

    }
    console.log(`count: ${count}`)
    
    if (count === 1) {
        children[value].click();
    }
    
    refresh.style.display = (count === 0)?'block':'none';
    // markers.forEach((marker) => {});
}


function refreshFilter() {
    document.getElementById('filter').value = '';
    contentUpdate()
}


function showChoices() {
    let ddContainer = document.getElementById('dropdown-content');
    ddContainer.style.opacity = (ddContainer.style.opacity === '0' || ddContainer.style.opacity === '') ? '100' : '0';
}

function changeAppearance() {

    mapOptions = (mapOptions == '"stylesnight"') ? 'stylesday' : 'stylesnight';

    localStorage.setItem("mapOptions", JSON.stringify(mapOptions));
    location.reload();
    
}

function rightSide(markerId, description) {

    console.log('rights')
    let rightSide = document.getElementById('right-side-content-box');
    let rightSideContent = document.getElementById('right-side-content');

    rightSide.style.display = 'block';
    rightSideContent.innerHTML = `<h1>${markers[markerId].title}</h1><br><p><i class="fas fa-map-pin"></i>&nbsp;
 ${markers[markerId].address}</p><p><i class="fas fa-map-marked-alt"></i>&nbsp; ${markers[markerId].position}</p><br><p>${description}</p>`;
    
    
}

function rightSideExit() {

    let rightSide = document.getElementById('right-side-content-box');

    rightSide.style.display = 'none';

}
