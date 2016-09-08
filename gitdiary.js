var token = "" // Your personal access token.
var login = "" // Authenticated GitHub account
var user  = "" // Username where the repository can be found
var repo  = "" // Name of the repository

var d = new Date(), file = d.getFullYear()+'-'+("0" + (d.getMonth()+1)).slice(-2), msg = "", commit_date=""

function grab() {

  // If there's a .md file for the current month, download it. If
  // that 404s, we will create a new file instead.

  var request = new XMLHttpRequest()

  request.onreadystatechange = function() {
      if(request.readyState == 4 && request.status == 200) {
          if (request.response) {
            var json = JSON.parse(request.response)
            if ((json.content)&&(json.sha)) {
              modify(atob(json.content),json.sha,false)
            }
          }
      } else {
        if (request.status == 404) {
          modify("", 0, true)
        }
      }
  }

  request.open('get', 'https://api.github.com/repos/'+user+'/'+repo+'/contents/'+file+'.md')
  request.setRequestHeader("Authorization", "token "+token)
  request.send(null)

}

function modify(contents, sha, create) {

  // Add diary entry to .md file.

  var today = file+'-'+("0" + (d.getDate())).slice(-2), sameDay=false,
  time = ("0" + d.getHours()).slice(-2)+":"+("0" + d.getMinutes()).slice(-2)

  commit_date = today+" "+time

  if (!create) {

    // Check if the first line is today's header.
    // If it is, remove it so we can add the diary
    // entry to the same section.

    var lines = contents.split("\n")

    if (lines[0]==='## '+today) {
      lines.splice(0,1)
      sameDay=true
      contents=lines.join("\n")
    }

  }

  // If this is a new day, add a new line.
  if ((!create)&&(!sameDay)) contents = "\n" + contents

  // Insert at the top of the document.
  contents = "\n* `"+time+"` "+msg+"\n"+contents
  contents = "## "+today+"\n"+contents

  if (create) sha = false

  commit(contents, sha)

}

function commit(contents, sha) {

  // Either create or update the .md file.

  var request = new XMLHttpRequest()

  request.onreadystatechange = function() {

      if(request.readyState == 4 && request.status == 200) {

          if (request.response) {

            var json = JSON.parse(request.response)

            if (json.commit.sha) {
              alert('Hooray. Added entry to diary ('+file+'.md, SHA '+json.commit.sha+').')
            } else {
              alert('Something went wrong :(')
            }

          }

      }

  }

  request.open('put', 'https://api.github.com/repos/'+user+'/'+repo+'/contents/'+file+'.md')
  request.setRequestHeader("Authorization", "token "+token)
  request.setRequestHeader("Content-type", "application/json")

  var data = {login:login,
              path:file+'.md',
              message:'Adding entry for '+commit_date,
              content:btoa(contents)}

  if (sha) { data.sha = sha; }

  data = JSON.stringify(data)

  request.send(data)

}


function user_prompt() {

  msg = prompt("Add to diary:", msg)

  if (msg != null) {
    user_confirm()
  }

}

function user_confirm() {

  var r = confirm("Add following to diary?\n\n"+msg)

  if (r == true) {
    grab()
  } else {
    user_prompt()
  }

}

user_prompt()
