document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const monthlyRepaymentSpan = document.getElementById("monthly-repayment");
  const totalRepaymentSpan = document.getElementById("total-repayment");
  const submitButton = document.querySelector("button[type='submit']");
  const clearLink = document.querySelector(".clear-link");

  // Divy, które będą przełączane
  const secondDiv = document.getElementById("second");
  const thirdDiv = document.getElementById("third");

  // Pokaż domyślny widok
  showDiv(secondDiv);

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Zapobiega przeładowaniu strony

    // Pobieranie wartości z formularza
    const amountInput = document.getElementById("mortage-amount");
    const termInput = document.getElementById("mortgage-term");
    const rateInput = document.getElementById("interest-rate");
    const repaymentRadio = document.getElementById("repayment");
    const interestOnlyRadio = document.getElementById("interest-only");

    // Resetowanie błędów
    resetValidation();

    let hasError = false;

    // warunki każdego pola
    if (!amountInput.value || parseFloat(amountInput.value) <= 0) {
      showError(amountInput, "This field is required");
      hasError = true;
    }

    if (!termInput.value || parseInt(termInput.value, 10) <= 0) {
      showError(termInput, "This field is required");
      hasError = true;
    }

    if (!rateInput.value || parseFloat(rateInput.value) <= 0) {
      showError(rateInput, "This field is required");
      hasError = true;
    }

    if (!repaymentRadio.checked && !interestOnlyRadio.checked) {
      showGlobalError(submitButton, "Please select a mortgage type");
      hasError = true;
    }

    // Jeśli są błędy, zatrzymaj dalsze przetwarzanie i pokaż widok domyślny
    if (hasError) {
      showDiv(secondDiv);
      return;
    }

    // Jeśli wszystkie pola są poprawne, wykonaj obliczenia
    const amount = parseFloat(amountInput.value);
    const term = parseInt(termInput.value, 10);
    const rate = parseFloat(rateInput.value);
    const isRepayment = repaymentRadio.checked;

    const monthlyRate = rate / 12 / 100;
    const totalMonths = term * 12;

    let monthlyRepayment = 0;
    let totalRepayment = 0;

    if (isRepayment) {
      // Oblicz ratę równą
      monthlyRepayment =
        (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
      totalRepayment = monthlyRepayment * totalMonths;
    } else {
      // Oblicz kredyt interest-only
      monthlyRepayment = amount * monthlyRate;
      totalRepayment = monthlyRepayment * totalMonths;
    }

    // Aktualizuj wyniki w HTML
    monthlyRepaymentSpan.textContent = `£${monthlyRepayment.toFixed(2)}`;
    totalRepaymentSpan.textContent = `£${totalRepayment.toFixed(2)}`;

    // Pokaż wyniki
    showDiv(thirdDiv);
  });

  function showError(input, message) {
    const wrapper = input.closest(".input-wrapper");
    if (wrapper) {
      wrapper.classList.add("error"); // Dodaj klasę error do wrappera
    }

    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;

    input.classList.add("error"); // Dodaj klasę error do inputu

    input.parentNode.parentNode.appendChild(errorElement);
  }

  function showGlobalError(referenceElement, message) {
    const errorElement = document.createElement("div");
    errorElement.className = "error-message global-error";
    errorElement.textContent = message;

    // Dodaj komunikat przed przyciskiem
    referenceElement.parentNode.insertBefore(errorElement, referenceElement);
  }

  function resetValidation() {
    // Usuń wszystkie błędy
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    document
      .querySelectorAll(".error")
      .forEach((el) => el.classList.remove("error"));
    document
      .querySelectorAll(".input-wrapper.error")
      .forEach((el) => el.classList.remove("error"));
  }

  function showDiv(divToShow) {
    // Ukryj wszystkie divy
    secondDiv.style.display = "none";
    thirdDiv.style.display = "none";

    // Pokaż wybrany div
    divToShow.style.display = "block";
  }

  clearLink.addEventListener("click", (event) => {
    event.preventDefault(); // Zapobiega przeładowaniu strony

    // Resetowanie formularza
    form.reset();

    // Resetowanie wyników
    monthlyRepaymentSpan.textContent = "£0.00";
    totalRepaymentSpan.textContent = "£0.00";

    // Resetowanie błędów
    resetValidation();

    // Powrót do widoku początkowego
    showDiv(secondDiv);
  });
});
