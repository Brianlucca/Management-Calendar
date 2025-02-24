export const validateName = (name) =>
    !name.trim() ? "O nome é obrigatório." :
    !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name) ? "O nome não pode conter números ou caracteres especiais." : 
    "";

export const validateEmail = (email) =>
    !email.trim() ? "O e-mail é obrigatório." :
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Por favor, insira um e-mail válido." :
    "";

export const validatePassword = (password) =>
    !password ? "A senha é obrigatória." :
    password.length < 8 ? "A senha deve ter pelo menos 8 caracteres." :
    "";

export const validateConfirmPassword = (password, confirmPassword) =>
    !confirmPassword ? "A confirmação de senha é obrigatória." :
    password !== confirmPassword ? "As senhas não coincidem." :
    "";
