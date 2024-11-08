document.addEventListener("DOMContentLoaded", () => {
    const bookBtn = document.getElementById("bookBtn");
    const message = document.getElementById("message");
    const timeInput = document.getElementById("time");
    const serviceSelect = document.getElementById("service");
    const dateInput = document.getElementById("date");
    const viewBookingsBtn = document.getElementById("viewBookingsBtn");
    const clientBookings = document.getElementById("clientBookings");
    const manutencaoOptions = document.getElementById("manutencaoOptions");
    const manutencaoOption = document.getElementById("manutencaoOption");

    const loginBtn = document.getElementById("loginBtn");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const loginMessage = document.getElementById("loginMessage");
    const adminCalendar = document.getElementById("adminCalendar");
    const bookingsContainer = document.getElementById("bookingsContainer");

    const logoutBtn = document.getElementById("logoutBtn");
    const deleteBookingsBtn = document.getElementById("deleteBookingsBtn");
    const deleteMessage = document.getElementById("deleteMessage");

    // Função para salvar agendamento
    if (bookBtn) {
        bookBtn.addEventListener("click", () => {
            const date = dateInput.value;
            const time = timeInput.value;
            const service = serviceSelect.value;
            const clientName = document.getElementById("clientName").value;
            const manutencaoSelected = manutencaoOption ? manutencaoOption.value : null;

            // Validações para garantir que os campos necessários foram preenchidos
            if (!date || !clientName || !time || !service || (service === "Manutenção" && !manutencaoSelected)) {
                message.textContent = "Por favor, preencha todos os campos: data, horário, serviço e nome do cliente.";
                message.style.color = "red";
                return;
            }

            // Formata a data e hora para exibição e armazenamento
            const bookingDateTime = new Date(`${date}T${time}`);
            const formattedDate = bookingDateTime.toLocaleDateString('pt-BR');
            const formattedTime = bookingDateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

            if (!bookings[formattedDate]) {
                bookings[formattedDate] = [];
            }

            // Verifica se já existe um agendamento no mesmo horário para evitar conflitos
            const conflict = bookings[formattedDate].some(entry => entry.time === formattedTime && entry.service === service);
            if (conflict) {
                message.textContent = "Horário já reservado para este serviço. Escolha outro horário.";
                message.style.color = "red";
            } else {
                bookings[formattedDate].push({ time: formattedTime, service, clientName, manutencao: manutencaoSelected });
                localStorage.setItem("bookings", JSON.stringify(bookings));

                message.textContent = `Agendamento confirmado para ${formattedDate} às ${formattedTime}!`;
                message.style.color = "green";
            }
        });
    }

    // Exibir os agendamentos para o cliente
    if (viewBookingsBtn) {
        viewBookingsBtn.addEventListener("click", () => {
            const bookings = JSON.parse(localStorage.getItem("bookings")) || {};
            let output = "<h2>Seus Agendamentos</h2>";
            for (const date in bookings) {
                output += `<h3>${date}</h3><ul>`;
                bookings[date].forEach((booking) => {
                    output += `<li>${booking.time} - ${booking.service} ${booking.manutencao ? `(${booking.manutencao})` : ''} (Cliente: ${booking.clientName})</li>`;
                });
                output += "</ul>";
            }
            clientBookings.innerHTML = output;
        });
    }

    // Lógica para alterar as opções do serviço
    if (serviceSelect) {
        serviceSelect.addEventListener("change", () => {
            if (serviceSelect.value === "Manutenção") {
                manutencaoOptions.style.display = "block"; // Exibe as opções de manutenção
            } else {
                manutencaoOptions.style.display = "none"; // Esconde as opções de manutenção
            }
        });
    }

    // Adiciona validação inicial
    if (serviceSelect.value === "Manutenção") {
        manutencaoOptions.style.display = "block"; // Exibe as opções de manutenção ao carregar
    } else {
        manutencaoOptions.style.display = "none"; // Esconde as opções se não for manutenção
    }

    // Função para exibir os agendamentos no painel do administrador
    const displayBookings = () => {
        const bookings = JSON.parse(localStorage.getItem("bookings")) || {};
        let output = "<h2>Agendamentos</h2>";
        for (const date in bookings) {
            output += `<h3>${date}</h3><ul>`;
            bookings[date].forEach((booking) => {
                output += `<li>${booking.time} - ${booking.service} ${booking.manutencao ? `(${booking.manutencao})` : ''} (Cliente: ${booking.clientName})</li>`;
            });
            output += "</ul>";
        }
        bookingsContainer.innerHTML = output;
    };

    // Login do administrador
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            if (username.value === "Juliana" && password.value === "Lari2107") {
                document.getElementById("loginSection").style.display = "none";
                adminCalendar.style.display = "block";
                displayBookings(); // Mostra os agendamentos após o login
            } else {
                loginMessage.textContent = "Usuário ou senha incorretos.";
                loginMessage.style.color = "red";
            }
        });
    }

    // Logout do administrador
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            adminCalendar.style.display = "none";
            document.getElementById("loginSection").style.display = "block";
        });
    }

    // Botão para excluir todos os agendamentos
    if (deleteBookingsBtn) {
        deleteBookingsBtn.addEventListener("click", () => {
            localStorage.removeItem("bookings");
            deleteMessage.textContent = "Todos os agendamentos foram excluídos.";
            deleteMessage.style.color = "green";
            displayBookings(); // Atualiza a lista após a exclusão
        });
    }
});
