function bytesToSize(bytes)
{
	if (!bytes) return '';
	if (bytes == 0) return '0 Byte';
	var k = 1000;
	var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var i = Math.floor(Math.log(bytes) / Math.log(k));
	return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

function LinkButtonTrigger_Click(sender)
{
    var NavigationMenu = document.getElementById('NavigationMenu');
    var cssClass = "open";
    if(containsClass(NavigationMenu, cssClass))
        removeClass(NavigationMenu, cssClass);
    else
        addClass(NavigationMenu, cssClass);
}

function LinkButtonFAB_Click(sender)
{
    var dialog_upload = document.getElementById('Dialog_Upload');
    var dialog = document.getElementById('Dialog');
    var cssClass = "open";
    if(containsClass(dialog, cssClass))
        removeClass(dialog, cssClass);
    else if(containsClass(dialog_upload, cssClass))
        removeClass(dialog_upload, cssClass);
    else
        addClass(dialog_upload, cssClass);
}

function openDialog(title, description, placeHolder, leftPlaceHolder, leftEvent, rightPlaceHolder, rightEvent)
{
    var dialog_upload = document.getElementById('Dialog_Upload');
    var dialog = document.getElementById('Dialog');
    var cssClass = "open";
    if(containsClass(dialog_upload, cssClass))
        removeClass(dialog_upload, cssClass);
    else if(containsClass(dialog, cssClass))
        removeClass(dialog, cssClass);
    else {
        document.getElementById('Dialog_Title').innerHTML = title;
        document.getElementById("Dialog_Description").innerHTML = description;
        document.getElementById("Dialog_PlaceHolder").innerHTML = placeHolder;
        addClass(dialog, cssClass);
        
        if(leftPlaceHolder != null || leftEvent != null)
        {
            var leftButton = document.createElement("div");
            leftButton.setAttribute('ng-controller', 'FileCtrl');
            leftButton.setAttribute('class', 'button label-blue left');
            leftButton.addEventListener("click", function(e) {
                if(leftEvent)
                    leftEvent(e);
                if(containsClass(dialog, "open"))
                    removeClass(dialog, "open");
            });
            
            var contentLeftButton = document.createElement("div");
            contentLeftButton.setAttribute('class', 'center');
            contentLeftButton.innerHTML = leftPlaceHolder;
            leftButton.appendChild(contentLeftButton);
            
            document.getElementById("Dialog_Footer").appendChild(leftButton);
        }
        
        if(rightPlaceHolder != null || rightEvent != null)
        {
            var rightButton = document.createElement("div");
            rightButton.setAttribute('ng-controller', 'FileCtrl');
            rightButton.setAttribute('class', 'button right');
            rightButton.addEventListener("click", function(e) {
                if(rightEvent)
                    rightEvent(e);
                if(containsClass(dialog, "open"))
                    removeClass(dialog, "open");
            });
            
            var contentRightButton = document.createElement("div");
            contentRightButton.setAttribute('class', 'center');
            contentRightButton.innerHTML = rightPlaceHolder;
            rightButton.appendChild(contentRightButton);
            
            document.getElementById("Dialog_Footer").appendChild(rightButton);
        }
    }
}
       

function containsClass(element, classToCompare) {
    return (element.className.indexOf(classToCompare) != -1);
}

function addClass(element, classToAdd) {
    var currentClassValue = element.className;
      
    if (currentClassValue.indexOf(classToAdd) == -1) {
        if ((currentClassValue == null) || (currentClassValue === "")) {
            element.className = classToAdd;
        } else {
            element.className += " " + classToAdd;
        }
    }
}
 
function removeClass(element, classToRemove) {
    var currentClassValue = element.className;
 
    if (currentClassValue == classToRemove) {
        element.className = "";
        return;
    }
 
    var classValues = currentClassValue.split(" ");
    var filteredList = [];
 
    for (var i = 0 ; i < classValues.length; i++) {
        if (classToRemove != classValues[i]) {
            filteredList.push(classValues[i]);
        }
    }
 
    element.className = filteredList.join(" ");
}
