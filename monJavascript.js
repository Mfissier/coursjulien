// Fonctions de vérifications de champs

// Pour l'INPUT NAME et pour l'INPUT PRENAME, j'ai voulu que des caract.

function formatModi(inputElement, formatType) {
    // j'autorise que les lettres et le signe (-) que je mets dans ma variable (input.value)
    inputElement.value = inputElement.value.replace(/[^A-Za-z-]/g, '');
    if (formatType === 'name') {
        inputElement.value = inputElement.value.toUpperCase();
    } else if (formatType === 'prename') {
        if (inputElement.value.length > 0) {
            inputElement.value = inputElement.value.charAt(0).toUpperCase() + inputElement.value.slice(1).toLowerCase();
        }
    }
}

function formatPseudo(inputElement) {
    // Cette expression régulière accepte les lettres, les chiffres, '-' et '_'
    inputElement.value = inputElement.value.replace(/[^a-zA-Z0-9-_]/g, '');
}

// ici cette function sert à vérifier le mail, j'autorise les chiffres, les caracteres classiques -_. @
function formatMail(inputElement) {
    let saisie = inputElement.value.toLowerCase(); // Convertir en minuscules dès le départ
    let nouvelleSaisie = '';
    for (let i = 0; i < saisie.length; i++) {
        let caractere = saisie.charAt(i);
        // Utiliser seulement les caractères minuscules pour la vérification
        if ('abcdefghijklmnopqrstuvwxyz0123456789-_.@'.includes(caractere)) {
            nouvelleSaisie += caractere;
        }
    }
    inputElement.value = nouvelleSaisie;
}

// Pour les téléphones les fixes, le prefixe est de 0 avec 10 chiffres, j'interdis les caractères alphanumériques
function formatValidateTelFixe() {
    var input = document.getElementById('telephoneF');
    var value = input.value;
    var validValue = value.replace(/[^0-9]/g, ''); // Supprime tous les caractères qui ne sont pas des chiffres
    
    // Vérifie si le premier chiffre est zéro lorsqu'il y a au moins un chiffre
    if (validValue.length > 0 && validValue[0] !== '0') {
        validValue = '0' + validValue.substring(1);
    }

    // Assure que la longueur ne dépasse pas 10 chiffres
    validValue = validValue.substring(0, 10);

    // Met à jour la valeur de l'input avec la valeur corrigée
    input.value = validValue;
}

// Pour les téléphones mobiles, le prefixe est de 0 avec 10 chiffres, j'interdis les caractères alphanumériques mais en je fais une preselection 06 et 07 
function formatValidateTel() {
    var inputField = document.getElementById('telephone');
    var currentValue = inputField.value;
    var cleanedInput = currentValue.replace(/\D/g, '');
    if (cleanedInput.startsWith('0') && /^0[67]/.test(cleanedInput)) {
        inputField.value = cleanedInput.substring(0, Math.min(cleanedInput.length, 10));
    } else if (cleanedInput.startsWith('0')) {
        inputField.value = '0';
    } else {
        inputField.value = '';
    }
}

// Function pour une carte style fidelité un numéro composé de 15 chiffres
function inserTNumCard() {
    var input = document.getElementById('numeroCard');
    var value = input.value;

    // Supprimer tous les caractères non numériques
    var filteredValue = value.replace(/[^0-9]/g, '');

    // Limiter la longueur à 15 chiffres
    if (filteredValue.length > 15) {
        filteredValue = filteredValue.substring(0, 15);
    }

    // Mettre à jour la valeur de l'input avec la valeur filtrée
    input.value = filteredValue;
}

// là, la verification du mot de pass peut bugguer
document.addEventListener('DOMContentLoaded', function() {
    var passwordInput = document.getElementById('mdpHash');
    passwordInput.oninput = handlePasswordInput;  // Contrôler la saisie sans afficher d'erreur
    passwordInput.onblur = displayPasswordError;  // Afficher l'erreur après la saisie
});

function handlePasswordInput() {
    var password = document.getElementById('mdpHash').value;
    var regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (regex.test(password)) {
        document.getElementById('passwordError').style.display = 'none';
        document.getElementById('mdpHash').classList.remove('input-error');
    }
}

function displayPasswordError() {
    var password = document.getElementById('mdpHash').value;
    var errorElement = document.getElementById('passwordError');
    var regex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/;

    if (!regex.test(password) && password.length > 0) {
        errorElement.style.display = 'block';
        errorElement.textContent = "Votre mot de passe doit contenir au minimum une majuscule, un chiffre, un symbole et au minimum 8 caractères.";
        document.getElementById('mdpHash').classList.add('input-error');
    } else {
        errorElement.style.display = 'none';
        document.getElementById('mdpHash').classList.remove('input-error');
    }
}

// function mot de pass avec l'oeil 
function togglePasswordVisibility() {
    var passwordInput = document.getElementById('mdpHash');
    var eyeIcon = document.getElementById('eyeIcon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fa-regular fa-eye';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fa-regular fa-eye-slash';
    }
}

// Clear previous errors function
function clearPreviousErrors() {
    document.querySelector('.pseudoError').style.display = 'none';
    document.getElementById('pseudo').classList.remove('input-error');
    document.querySelector('.mailError').style.display = 'none';
    document.getElementById('email').classList.remove('input-error');
    document.querySelector('.telError').style.display = 'none';
    document.getElementById('telephone').classList.remove('input-error');
}

// Là, est mon grand souci, je n'arrive pas à faire afficher les erreurs de doublons. En clair, une fois que le formulaire est soumis, si il y a un doublon, j'aimerai 
// que les erreurs s'affichent dans mon formulaire (index.html) voir l'index.html :
// <div class="pseudoError error-message">C'est ici en cas de doublno: pseudo déjà connu</div>
//<div class="mailError error-message">C'est ici en cas de doublon: mail déjà connu</div>
//<div class="telError error-message">Numéro de téléphone mobile déjà connu dans notre base de données</div>
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le formulaire de se soumettre traditionnellement
    clearPreviousErrors();  // Effacer les erreurs précédentes
    var formData = new FormData(this);

    fetch('soumission.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            // Gestion des erreurs
            if (data.errors.pseudo) {
                document.querySelector('.pseudoError').textContent = data.errors.pseudo;
                document.querySelector('.pseudoError').style.display = 'block';
                document.getElementById('pseudo').classList.add('input-error');
            }
            if (data.errors.email) {
                document.querySelector('.mailError').textContent = data.errors.email;
                document.querySelector('.mailError').style.display = 'block';
                document.getElementById('email').classList.add('input-error');
            }
            if (data.errors.telephone) {
                document.querySelector('.telError').textContent = data.errors.telephone;
                document.querySelector('.telError').style.display = 'block';
                document.getElementById('telephone').classList.add('input-error');
            }
        } else {
            window.location.href = 'connectez-vous.html';
        }
    })
    .catch(error => {
        console.error('Erreur AJAX : ', error);
    });
});
