// Função para restringir o comprimento máximo do valor do campo
function enforceMaxLength(input, max) {
  if (input.value.length > max) {
    input.value = input.value.slice(0, max);
  }
}

// Permitir somente letras (e espaços) em campos de texto
function allowOnlyLetters(e) {
  const char = String.fromCharCode(e.which);
  const pattern = /[A-Za-zÀ-ú\s]/;
  if (!pattern.test(char)) {
    e.preventDefault();
    return false;
  }
  return true;
}

// Permitir somente números em campos numéricos
function allowOnlyNumbers(e) {
  const char = String.fromCharCode(e.which);
  if (!/[0-9]/.test(char)) {
    e.preventDefault();
    return false;
  }
  return true;
}

// Formatação simples de CPF (inserindo pontos e hífen)
function formatCPF(input) {
  let value = input.value.replace(/\D/g, '');
  // Limita o valor a 11 dígitos
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = value;
}

// Validação de CPF
function validateCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if(cpf === '' || cpf.length !== 11 || /^(.)\1+$/.test(cpf)) return false;
  let sum = 0, remainder;
  for (let i = 1; i <= 9; i++) 
      sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) 
      sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

function validateCPFField() {
  const cpfField = document.getElementById("cpf");
  const errorDiv = document.getElementById("cpfError");
  if (!validateCPF(cpfField.value)) {
    errorDiv.textContent = "CPF inválido!";
    return false;
  } else {
    errorDiv.textContent = "";
    return true;
  }
}

// Validação de e-mail
function validateEmailField() {
  const emailField = document.getElementById("email");
  const errorDiv = document.getElementById("emailError");
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(emailField.value)) {
    errorDiv.textContent = "E-mail em formato inválido!";
    return false;
  } else {
    errorDiv.textContent = "";
    return true;
  }
}

// Validação de senha e confirmação
function validatePasswordMatch() {
  const senha = document.getElementById("senha").value;
  const confirmSenha = document.getElementById("confirmSenha").value;
  const errorDiv = document.getElementById("senhaError");
  if (senha !== confirmSenha) {
    errorDiv.textContent = "As senhas não conferem!";
    return false;
  } else {
    errorDiv.textContent = "";
    return true;
  }
}

// Verifica a força da senha e atualiza o indicador
function checkPasswordStrength() {
  const senha = document.getElementById("senha").value;
  const strengthDiv = document.getElementById("senhaStrength");
  let strength = "";
  let color = "";
  
  // Critérios simples para verificação de força:
  // Fraca: menos de 6 caracteres ou sem números/caracteres especiais
  // Média: entre 6 e 10 caracteres, com letras e números
  // Forte: mais de 10 caracteres, com letras, números e caracteres especiais
  const hasLetters = /[A-Za-z]/.test(senha);
  const hasNumbers = /[0-9]/.test(senha);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
  
  if(senha.length < 6 || (!hasNumbers && !hasSpecial)) {
    strength = "Fraca";
    color = "red";
  } else if(senha.length >= 6 && senha.length <= 10 && hasLetters && hasNumbers) {
    strength = "Média";
    color = "orange";
  } else if(senha.length > 10 && hasLetters && hasNumbers && hasSpecial) {
    strength = "Forte";
    color = "green";
  } else {
    strength = "Média";
    color = "orange";
  }
  
  strengthDiv.textContent = `Força da senha: ${strength}`;
  strengthDiv.style.color = color;
}

// Busca endereço via CEP utilizando a API ViaCEP
function fetchCEP() {
  const cep = document.getElementById("cep").value.replace(/\D/g, '');
  const errorDiv = document.getElementById("cepError");
  if (cep.length !== 8) {
    errorDiv.textContent = "CEP inválido!";
    return;
  }
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (data.erro) {
        errorDiv.textContent = "CEP não encontrado!";
      } else {
        errorDiv.textContent = "";
        document.getElementById("endereco").value = data.logradouro || "";
        document.getElementById("cidade").value = data.localidade || "";
        document.getElementById("estado").value = data.uf || "";
      }
    })
    .catch(err => {
      errorDiv.textContent = "Erro ao buscar CEP!";
    });
}

// Máscara e formatação para CEP: 00000-000
function formatCEP(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 8) value = value.slice(0, 8);
  if (value.length > 5) {
    value = value.slice(0, 5) + '-' + value.slice(5);
  }
  input.value = value;
}

// Calcula a idade com base na data de nascimento
function calculateAge(birthDateStr) {
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}

// Mostra ou esconde campos para menores de 18 com base na data de nascimento
document.getElementById("birthDate").addEventListener("change", function() {
  const birthDate = this.value;
  if (!birthDate) return;
  const age = calculateAge(birthDate);
  const checkBox = document.getElementById("maioridade");
  const minorFields = document.getElementById("minorFields");
  if (age >= 18) {
    checkBox.checked = true;
    minorFields.style.display = "none";
  } else {
    checkBox.checked = false;
    minorFields.style.display = "block";
  }
});

// Máscara e formatação para Telefone Fixo: (XX) XXXX-XXXX
function formatTelefoneFixo(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 10) value = value.slice(0, 10);
  if (value.length > 0) {
    value = '(' + value;
  }
  if (value.length > 3) {
    value = value.slice(0, 3) + ') ' + value.slice(3);
  }
  if (value.length > 9) {
    value = value.slice(0, 9) + '-' + value.slice(9);
  }
  input.value = value;
}

// Máscara e formatação para Celular: (XX) XXXXX-XXXX
function formatCelular(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  if (value.length > 0) {
    value = '(' + value;
  }
  if (value.length > 3) {
    value = value.slice(0, 3) + ') ' + value.slice(3);
  }
  if (value.length > 10) {
    value = value.slice(0, 10) + '-' + value.slice(10);
  }
  input.value = value;
}

// Eventos para aplicar máscaras e formatação nos campos
document.getElementById("telefoneFixo").addEventListener("input", function() {
  formatTelefoneFixo(this);
});
document.getElementById("celular").addEventListener("input", function() {
  formatCelular(this);
});
document.getElementById("cep").addEventListener("input", function() {
  formatCEP(this);
});

// Eventos para aplicar o limite máximo de caracteres ou formatação nos outros campos
document.getElementById("cpf").addEventListener("input", function() {
  formatCPF(this);
});
document.getElementById("numero").addEventListener("input", function() {
  enforceMaxLength(this, 5);
});
document.getElementById("login").addEventListener("input", function() {
  enforceMaxLength(this, 15);
});

// Função para validar campos obrigatórios e outras validações personalizadas
function validateForm(event) {
  event.preventDefault();
  let isValid = true;
  
  // Validação dos campos obrigatórios (baseado no atributo required)
  const requiredFields = document.querySelectorAll("#registrationForm input[required]");
  requiredFields.forEach(field => {
    const errorDiv = document.getElementById(field.id + "Error");
    if (field.value.trim() === "") {
      errorDiv.textContent = "Este campo é obrigatório!";
      isValid = false;
    } else {
      errorDiv.textContent = "";
    }
  });
  
  // Validações específicas
  if (!validateCPFField()) isValid = false;
  if (!validateEmailField()) isValid = false;
  if (!validatePasswordMatch()) isValid = false;
  
  // Outras validações específicas podem ser adicionadas aqui
  
  if (isValid) {
    alert("Formulário enviado com sucesso!");
    // Aqui você pode realizar o envio do formulário via AJAX ou outras ações
  }
}

// Evento para submissão do formulário
document.getElementById("registrationForm").addEventListener("submit", validateForm);
