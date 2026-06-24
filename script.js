const languages = {
    "auto":"Auto Detect",
    "af":"Afrikaans", "sq":"Albanian", "ar":"Arabic", "bn":"Bengali",
    "bg":"Bulgarian", "ca":"Catalan", "zh-CN":"Chinese (Simplified)",
    "zh-TW":"Chinese (Traditional)", "hr":"Croatian", "cs":"Czech",
    "da":"Danish", "nl":"Dutch", "en":"English", "et":"Estonian",
    "fi":"Finnish", "fr":"French", "de":"German", "el":"Greek",
    "gu":"Gujarati", "he":"Hebrew", "hi":"Hindi", "hu":"Hungarian",
    "id":"Indonesian", "it":"Italian", "ja":"Japanese", "kn":"Kannada",
    "ko":"Korean", "lv":"Latvian", "lt":"Lithuanian", "ms":"Malay",
    "ml":"Malayalam", "mr":"Marathi", "ne":"Nepali", "no":"Norwegian",
    "fa":"Persian", "pl":"Polish", "pt":"Portuguese", "pa":"Punjabi",
    "ro":"Romanian", "ru":"Russian", "sr":"Serbian", "sk":"Slovak",
    "sl":"Slovenian", "es":"Spanish", "sw":"Swahili", "sv":"Swedish",
    "ta":"Tamil", "te":"Telugu", "th":"Thai", "tr":"Turkish",
    "uk":"Ukrainian", "ur":"Urdu", "vi":"Vietnamese", "cy":"Welsh"
};

const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");
const translateBtn = document.getElementById("translateBtn");

// Populate Language Dropdowns
for(const code in languages){
    const sourceOption = document.createElement("option");
    sourceOption.value = code;
    sourceOption.textContent = languages[code];
    sourceLang.appendChild(sourceOption);

    if(code !== "auto"){
        const targetOption = document.createElement("option");
        targetOption.value = code;
        targetOption.textContent = languages[code];
        targetLang.appendChild(targetOption);
    }
}

sourceLang.value = "en";
targetLang.value = "hi";

// Translate Function
async function translateText(){
    const text = document.getElementById("inputText").value.trim();

    if(text === ""){
        alert("Please enter text.");
        return;
    }

    const source = sourceLang.value;
    const target = targetLang.value;

    // UI Feedback: Change button text
    const originalBtnText = translateBtn.innerHTML;
    translateBtn.innerHTML = "⏳ Translating...";
    translateBtn.style.opacity = "0.8";

    try{
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
        );

        const data = await response.json();
        let translatedText = "";

        data[0].forEach(item=>{
            translatedText += item[0];
        });

        document.getElementById("outputText").value = translatedText;

    }catch(error){
        console.error(error);
        alert("Translation failed.");
    } finally {
        // Restore button text
        translateBtn.innerHTML = originalBtnText;
        translateBtn.style.opacity = "1";
    }
}

// Copy Function
function copyText(){
    const text = document.getElementById("outputText").value;

    if(text === ""){
        alert("Nothing to copy.");
        return;
    }

    navigator.clipboard.writeText(text);
    // Optional: Temporary change button text to show success
    const copyBtn = document.querySelector('.copy-btn');
    copyBtn.innerHTML = "✅ Copied!";
    setTimeout(() => { copyBtn.innerHTML = "📋 Copy"; }, 2000);
}

// Text To Speech
function speakText(){
    const text = document.getElementById("outputText").value;

    if(text === ""){
        alert("No translated text available.");
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = targetLang.value;
    window.speechSynthesis.speak(speech);
}
