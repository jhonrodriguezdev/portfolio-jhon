 /**
 * Motor de Orquestación Simplificado - Mitigación de Alucinaciones
 * Simula la inyección de contexto para un sistema RAG (Retrieval-Augmented Generation)
 */

// Base de datos local que actúa como nuestra "Fuente de la Verdad"
const BUSINESS_CONTEXT = {
    companyName: "Casa Moderna",
    services: "Remodelación de espacios residenciales, cocinas integrales y acabados de lujo.",
    location: "Medellín, Colombia",
    restrictions: "No realizamos construcciones desde cero (obra negra), solo remodelaciones e interiorismo."
};

/**
 * Filtra e inyecta contexto real en el prompt del usuario
 * @param {string} userPrompt - La consulta cruda del cliente
 * @returns {string} Prompt optimizado y blindado contra alucinaciones
 */
function orchestrateAIRequest(userPrompt) {
    const query = userPrompt.toLowerCase();
    let contextInjection = `Información oficial de la empresa: ${BUSINESS_CONTEXT.companyName}. Ubicación: ${BUSINESS_CONTEXT.location}. `;

    // Evaluación semántica (Filtro de negocio para mitigar alucinaciones)
    if (query.includes("construir") || query.includes("casa desde cero") || query.includes("lote")) {
        contextInjection += `REGLA CRÍTICA: Recuerda al usuario de manera cortés que ${BUSINESS_CONTEXT.restrictions}`;
    } else if (query.includes("servicio") || query.includes("hacen") || query.includes("cocina")) {
        contextInjection += `Portafolio autorizado: ${BUSINESS_CONTEXT.services}`;
    } else {
        contextInjection += "Responde con tono profesional corporativo basándote únicamente en diseño de interiores.";
    }

    // Construcción del Prompt Final (System Instruction + Contexto + User Prompt)
    const finalPrompt = `
[SYSTEM INSTRUCTION]
Eres el asistente virtual de ${BUSINESS_CONTEXT.companyName}. Responde con base estricta en el contexto proveído. Si la respuesta no se encuentra en el contexto, di amablemente que no posees esa información. NO inventes datos.

[CONTEXT]
${contextInjection}

[USER QUESTION]
${userPrompt}
    `.trim();

    return finalPrompt;
}

// === EJECUCIÓN DE PRUEBA (Simulación en Consola) ===
const promptArriesgado = "¿Me pueden construir una casa de 3 pisos en un lote vacío?";
console.log("--- PROMPT ORIGINAL DEL USUARIO ---");
console.log(promptArriesgado);

console.log("\n--- PROMPT ENVIADO AL LLM (ORQUESTADO CON ÉXITO) ---");
const promptSeguro = orchestrateAIRequest(promptArriesgado);
console.log(promptSeguro);