const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// Form toggle functionality
const loginForm = document.querySelector(".login-form")
const signupForm = document.querySelector(".signup-form")
const forgotPasswordForm = document.querySelector(".forgot-password-form")
const toggleFormLinks = document.querySelectorAll(".toggle-form")

toggleFormLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const targetForm = link.dataset.form

    if (targetForm === "login") {
      loginForm.classList.add("active")
      signupForm.classList.remove("active")
      forgotPasswordForm.classList.remove("active")
    } else if (targetForm === "signup") {
      signupForm.classList.add("active")
      loginForm.classList.remove("active")
      forgotPasswordForm.classList.remove("active")
    }
  })
})

const forgotLoginBtn = document.getElementById("forgotLoginBtn")
const backFromForgotBtn = document.getElementById("backFromForgot")

if (forgotLoginBtn) {
  forgotLoginBtn.addEventListener("click", (e) => {
    e.preventDefault()
    loginForm.classList.remove("active")
    forgotPasswordForm.classList.add("active")
  })
}

if (backFromForgotBtn) {
  backFromForgotBtn.addEventListener("click", (e) => {
    e.preventDefault()
    forgotPasswordForm.classList.remove("active")
    loginForm.classList.add("active")
  })
}

function showLoading(show = true) {
  const loadingOverlay = document.getElementById("loadingOverlay")
  if (show) {
    loadingOverlay.classList.add("active")
  } else {
    loadingOverlay.classList.remove("active")
  }
}

// Password visibility toggle
const togglePasswordButtons = document.querySelectorAll(".toggle-password")

togglePasswordButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault()
    const targetId = button.dataset.target
    const input = document.getElementById(targetId)

    if (input.type === "password") {
      input.type = "text"
      button.classList.add("visible")
    } else {
      input.type = "password"
      button.classList.remove("visible")
    }
  })
})

function validateEmail(email) {
  return emailRegex.test(email)
}

function validatePassword(password) {
  return passwordRegex.test(password)
}

function validatePasswordMatch(password, confirm) {
  return password === confirm && password.length > 0
}

// Form submission
const loginFormElement = document.getElementById("loginForm")
const signupFormElement = document.getElementById("signupForm")
const forgotPasswordFormElement = document.getElementById("forgotPasswordForm")

loginFormElement.addEventListener("submit", (e) => {
  e.preventDefault()
  const email = document.getElementById("login-email").value.trim()
  const password = document.getElementById("login-password").value

  if (!email) {
    showToast("Email is required!", "error")
    return
  }

  if (!validateEmail(email)) {
    showToast("Please enter a valid email address!", "error")
    return
  }

  if (!password) {
    showToast("Password is required!", "error")
    return
  }

  if (password.length < 8) {
    showToast("Password must be at least 8 characters!", "error")
    return
  }

  showLoading(true)
  showToast(`Welcome back!`)
  setTimeout(() => {
    window.location.href = "dashboard.html"
  }, 2500)
})

signupFormElement.addEventListener("submit", (e) => {
  e.preventDefault()
  const firstName = document.getElementById("signup-first").value.trim()
  const lastName = document.getElementById("signup-last").value.trim()
  const email = document.getElementById("signup-email").value.trim()
  const password = document.getElementById("signup-password").value
  const confirm = document.getElementById("signup-confirm").value

  if (!firstName || !lastName) {
    showToast("First and last names are required!", "error")
    return
  }

  if (!email) {
    showToast("Email is required!", "error")
    return
  }

  if (!validateEmail(email)) {
    showToast("Please enter a valid email address!", "error")
    return
  }

  if (!password) {
    showToast("Password is required!", "error")
    return
  }

  if (!validatePassword(password)) {
    showToast("Password must have 8+ characters, uppercase, lowercase, number & special character (!@#$%^&*)", "error")
    return
  }

  if (!confirm) {
    showToast("Please confirm your password!", "error")
    return
  }

  if (!validatePasswordMatch(password, confirm)) {
    showToast("Passwords do not match!", "error")
    return
  }

  showLoading(true)
  showToast(`Welcome aboard, ${firstName}!`)
  setTimeout(() => {
    window.location.href = "dashboard.html"
  }, 2500)
})

forgotPasswordFormElement.addEventListener("submit", (e) => {
  e.preventDefault()
  const email = document.getElementById("forgot-email").value.trim()

  if (!email) {
    showToast("Email is required!", "error")
    return
  }

  if (!validateEmail(email)) {
    showToast("Please enter a valid email address!", "error")
    return
  }

  showLoading(true)
  showToast("Reset link sent to your email!")
  setTimeout(() => {
    showLoading(false)
    document.getElementById("forgot-email").value = ""
    forgotPasswordForm.classList.remove("active")
    loginForm.classList.add("active")
    showToast("You can now sign in with your new password!", "success")
  }, 2000)
})

// Toast notification function
function showToast(message, type = "success") {
  const toast = document.getElementById("toast")
  toast.textContent = message
  toast.className = `toast show ${type}`

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

// Add enter key support for forms
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      const submitButton = form.querySelector('button[type="submit"]')
      if (submitButton) {
        submitButton.click()
      }
    }
  })
})
