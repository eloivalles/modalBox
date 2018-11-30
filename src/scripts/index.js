import '../styles/index.scss';

function ajaxCall(url) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', url);
  
      req.onload = function() {
        if (req.status == 200) {
          resolve(JSON.parse(req.responseText));
        } else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      req.send();
    });
}

(function(){
    class modalModule {
        constructor () {
            this.btElement = document.getElementById('btModal');
            this.modal = document.getElementById('modalBox');
            this.modalBody = this.modal.getElementsByClassName("ModalComponent-content")[0];
            this.loader = '';
            
            this.init();
        }

        init(){
            // Set button close
            this.btClose = document.createElement('span');
            this.btClose.classList.add('close');
            this.btClose.innerHTML = '&times;';
            this.modal.getElementsByClassName("ModalComponent-wrapper")[0].append(this.btClose);

            // Set a loader spinner to show while fetching API data
            fetch('https://i.gifer.com/embedded/download/9wcA.gif')
            .then((response) => {
                if(response.ok) {
                  response.blob().then((miBlob) => {
                    const objectURL = URL.createObjectURL(miBlob);

                    this.loader = document.createElement('div');
                    this.loader.style.textAlign = 'center';
                    const loaderImg = document.createElement('img');
                    loaderImg.src = objectURL;
                    this.loader.append(loaderImg);
                    
                  });
                }
            });

            // set click listeners to open/close modal
            this.addListeners();
        }

        // Get test data from https://jsonplaceholder.typicode.com/
        LoadData() {
            ajaxCall('https://jsonplaceholder.typicode.com/todos/1')
            // .then(response => response.json())
            .then(task => {
                this.task = task;
                return ajaxCall('https://jsonplaceholder.typicode.com/users/' + task.userId);
            })
            // .then(response => response.json())
            .then(user => {
                this.user = user;
                this.fillModal();
            })
            .catch(function(error) {
                console.error(error.message);
            });
        }

        fillModal() {
            const taskState = this.task.completed ? 'completed' : 'uncompleted';
            this.modalBody.innerHTML = `<p>Dear ${this.user.name},</br>Your task ${this.task.title} it's ${taskState}<p>`;
        }

        openModal() {
            this.modal.classList.add('is-opened');
            this.modalBody.append(this.loader);
        }

        closeModal() {
            this.modal.classList.remove('is-opened');
            this.modalBody.innerHTML = '';
        }

        addListeners() {
            this.btElement.addEventListener('click', () => {
                this.openModal();
                this.LoadData();
            });

            this.btClose.addEventListener('click', () => {
                this.closeModal();
            });
        }
    }

    new modalModule();
})();
