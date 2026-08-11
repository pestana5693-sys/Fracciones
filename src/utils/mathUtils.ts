import { Fraction, Question, QuestionType } from '../types';

/**
/ * Máximo Común Divisor (MCD)
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

/**
 * Mínimo Común Múltiplo (MCM)
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
}

/**
 * Simplifica una fracción a su forma irreductible
 */
export function simplifyFraction(num: number, den: number): Fraction {
  if (den === 0) return { numerator: 0, denominator: 1 };
  const divisor = gcd(num, den);
  let n = num / divisor;
  let d = den / divisor;
  if (d < 0) {
    n = -n;
    d = -d;
  }
  return { numerator: n, denominator: d };
}

/**
 * Convierte fracción a String "n/d" o "n" si d === 1
 */
export function fractionToString(f: Fraction): string {
  const simplified = simplifyFraction(f.numerator, f.denominator);
  if (simplified.denominator === 1) {
    return `${simplified.numerator}`;
  }
  return `${simplified.numerator}/${simplified.denominator}`;
}

/**
 * Parsea un string "a/b" o "a" a un objeto Fraction
 */
export function parseFractionString(str: string): Fraction | null {
  const clean = str.trim();
  if (!clean) return null;

  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length !== 2) return null;
    const num = parseInt(parts[0], 10);
    const den = parseInt(parts[1], 10);
    if (isNaN(num) || isNaN(den) || den === 0) return null;
    return { numerator: num, denominator: den };
  } else {
    const num = parseInt(clean, 10);
    if (isNaN(num)) return null;
    return { numerator: num, denominator: 1 };
  }
}

/**
 * Genera un entero aleatorio entre min y max (incluidos)
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Genera una fracción aleatoria no nula
 */
export function generateRandomFraction(maxNum = 12, maxDen = 12, forceProper = false): Fraction {
  const den = getRandomInt(2, maxDen);
  let num: number;
  if (forceProper) {
    num = getRandomInt(1, den - 1);
  } else {
    num = getRandomInt(1, maxNum);
  }
  return { numerator: num, denominator: den };
}

/**
 * Mezcla un arreglo aleatoriamente (Shuffle)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generador Procedural de Preguntas para cada uno de los 6 Niveles
 */
export function generateQuestionsForLevel(levelId: number, count = 8): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    switch (levelId) {
      case 1:
        questions.push(generateLevel1Question(i));
        break;
      case 2:
        questions.push(generateLevel2Question(i));
        break;
      case 3:
        questions.push(generateLevel3Question(i));
        break;
      case 4:
        questions.push(generateLevel4Question(i));
        break;
      case 5:
        questions.push(generateLevel5Question(i));
        break;
      case 6:
        questions.push(generateLevel6Question(i));
        break;
      default:
        questions.push(generateLevel1Question(i));
    }
  }

  return questions;
}

// ---------------- LEVEL 1: Tipos de Fracciones ----------------
function generateLevel1Question(index: number): Question {
  const subType = index % 4;

  if (subType === 0) {
    // Clasificar Propia vs Impropia vs Mixta
    const isProper = Math.random() > 0.5;
    const den = getRandomInt(3, 10);
    const num = isProper ? getRandomInt(1, den - 1) : getRandomInt(den + 1, den * 2 + 2);
    const typeStr = isProper ? 'Propia' : 'Impropia';

    return {
      id: `l1_${index}_${Date.now()}`,
      type: 'multiple-choice',
      prompt: `¿Qué tipo de fracción es ${num}/${den}?`,
      subPrompt: 'Observa la relación entre el numerador (arriba) y el denominador (abajo).',
      visualData: { fraction: { numerator: num, denominator: den } },
      options: ['Propia', 'Impropia', 'Mixta', 'Equivalente'],
      correctAnswer: typeStr,
      explanationStepByStep: [
        `1. El numerador es ${num} y el denominador es ${den}.`,
        isProper
          ? `2. Como el numerador (${num}) es MENOR que el denominador (${den}), es una Fracción PROPIA (representa menos de 1 unidad).`
          : `2. Como el numerador (${num}) es MAYOR que el denominador (${den}), es una Fracción IMPROPIA (representa más de 1 unidad).`
      ]
    };
  } else if (subType === 1) {
    // Fracción equivalente
    const num = getRandomInt(1, 5);
    const den = getRandomInt(2, 6);
    const factor = getRandomInt(2, 4);
    const eqNum = num * factor;
    const eqDen = den * factor;

    // Generar opciones falsas
    const wrong1 = `${num + 1}/${den}`;
    const wrong2 = `${num}/${den + 1}`;
    const wrong3 = `${eqNum}/${eqDen + 2}`;
    const correct = `${eqNum}/${eqDen}`;

    const rawOptions = Array.from(new Set([correct, wrong1, wrong2, wrong3]));
    while (rawOptions.length < 4) {
      rawOptions.push(`${getRandomInt(1, 9)}/${getRandomInt(2, 9)}`);
    }

    return {
      id: `l1_${index}_${Date.now()}`,
      type: 'multiple-choice',
      prompt: `¿Cuál de las siguientes es una fracción equivalente a ${num}/${den}?`,
      subPrompt: `Multiplica el numerador y el denominador por el mismo número (por ejemplo, por ${factor}).`,
      visualData: { fraction: { numerator: num, denominator: den } },
      options: shuffleArray(rawOptions),
      correctAnswer: correct,
      explanationStepByStep: [
        `1. Para hallar una fracción equivalente, multiplicamos numerador y denominador por el mismo número.`,
        `2. ${num} × ${factor} = ${eqNum}, y ${den} × ${factor} = ${eqDen}.`,
        `3. Por lo tanto, ${eqNum}/${eqDen} representa exactamente la misma cantidad que ${num}/${den}.`
      ]
    };
  } else if (subType === 2) {
    // Convertir de Mixta a Impropia
    const whole = getRandomInt(1, 4);
    const num = getRandomInt(1, 4);
    const den = getRandomInt(num + 1, 6);
    const improperNum = whole * den + num;
    const correct = `${improperNum}/${den}`;

    const wrong1 = `${whole * den}/${den}`;
    const wrong2 = `${improperNum + 1}/${den}`;
    const wrong3 = `${improperNum}/${den + 1}`;
    const options = shuffleArray([correct, wrong1, wrong2, wrong3]);

    return {
      id: `l1_${index}_${Date.now()}`,
      type: 'multiple-choice',
      prompt: `Convierte el número mixto ${whole} ${num}/${den} a fracción impropia:`,
      subPrompt: 'Multiplica la parte entera por el denominador y súmale el numerador.',
      options,
      correctAnswer: correct,
      explanationStepByStep: [
        `1. Multiplicamos la parte entera (${whole}) por el denominador (${den}): ${whole} × ${den} = ${whole * den}.`,
        `2. Sumamos el numerador (${num}): ${whole * den} + ${num} = ${improperNum}.`,
        `3. Mantenemos el mismo denominador (${den}), resultando la fracción impropia ${improperNum}/${den}.`
      ]
    };
  } else {
    // Identificación visual (pie/bar)
    const den = getRandomInt(3, 8);
    const num = getRandomInt(1, den);
    const correct = `${num}/${den}`;

    const wrong1 = `${den - num}/${den}`;
    const wrong2 = `${num}/${den + 1}`;
    const wrong3 = `${num + 1}/${den}`;
    const options = shuffleArray(Array.from(new Set([correct, wrong1, wrong2, wrong3])));

    return {
      id: `l1_${index}_${Date.now()}`,
      type: 'multiple-choice',
      prompt: `¿Qué fracción representa la figura sombreada? (${num} de ${den} partes)`,
      subPrompt: 'El numerador son las partes coloreadas y el denominador es el total de partes iguales.',
      visualData: {
        fraction: { numerator: num, denominator: den },
        shapeType: index % 2 === 0 ? 'circle' : 'bar'
      },
      options,
      correctAnswer: correct,
      explanationStepByStep: [
        `1. Contamos las partes en que se dividió la figura: ${den} partes en total (denominador).`,
        `2. Contamos las partes coloreadas: ${num} partes (numerador).`,
        `3. La fracción correspondiente es ${num}/${den}.`
      ]
    };
  }
}

// ---------------- LEVEL 2: Comparación y Orden ----------------
function generateLevel2Question(index: number): Question {
  const isSameDenom = index % 2 === 0;

  if (isSameDenom) {
    const den = getRandomInt(4, 12);
    const num1 = getRandomInt(1, den - 1);
    let num2 = getRandomInt(1, den - 1);
    if (num1 === num2) num2 = num1 === 1 ? 2 : num1 - 1;

    let correctSymbol = '=';
    if (num1 > num2) correctSymbol = '>';
    if (num1 < num2) correctSymbol = '<';

    return {
      id: `l2_${index}_${Date.now()}`,
      type: 'compare-symbol',
      prompt: `Compara las siguientes fracciones con el mismo denominador:`,
      subPrompt: `Determina cuál símbolo de comparación (>, <, =) va entre ${num1}/${den}  y  ${num2}/${den}`,
      visualData: {
        fractions: [
          { numerator: num1, denominator: den },
          { numerator: num2, denominator: den }
        ]
      },
      options: ['>', '<', '='],
      correctAnswer: correctSymbol,
      explanationStepByStep: [
        `1. Ambas fracciones tienen el mismo denominador (${den}).`,
        `2. Cuando tienen igual denominador, es mayor la que tenga mayor numerador.`,
        `3. Como ${num1} es ${num1 > num2 ? 'mayor' : 'menor'} que ${num2}, la respuesta es: ${num1}/${den} ${correctSymbol} ${num2}/${den}.`
      ]
    };
  } else {
    // Diferente denominador - Productos Cruzados
    const den1 = getRandomInt(2, 6);
    const num1 = getRandomInt(1, den1);
    const den2 = getRandomInt(2, 6);
    const num2 = getRandomInt(1, den2);

    const cross1 = num1 * den2;
    const cross2 = num2 * den1;

    let correctSymbol = '=';
    if (cross1 > cross2) correctSymbol = '>';
    if (cross1 < cross2) correctSymbol = '<';

    return {
      id: `l2_${index}_${Date.now()}`,
      type: 'compare-symbol',
      prompt: `Compara las fracciones con distinto denominador:`,
      subPrompt: `Usa productos cruzados: multiplica ${num1} × ${den2} = ${cross1}  y  ${num2} × ${den1} = ${cross2}`,
      visualData: {
        fractions: [
          { numerator: num1, denominator: den1 },
          { numerator: num2, denominator: den2 }
        ]
      },
      options: ['>', '<', '='],
      correctAnswer: correctSymbol,
      explanationStepByStep: [
        `1. Método de productos cruzados:`,
        `2. Primer producto: ${num1} × ${den2} = ${cross1}`,
        `3. Segundo producto: ${num2} × ${den1} = ${cross2}`,
        `4. Como ${cross1} es ${cross1 > cross2 ? 'mayor que' : cross1 < cross2 ? 'menor que' : 'igual a'} ${cross2}, la relación es ${num1}/${den1} ${correctSymbol} ${num2}/${den2}.`
      ]
    };
  }
}

// ---------------- LEVEL 3: Suma de Fracciones ----------------
function generateLevel3Question(index: number): Question {
  const sameDenom = index % 2 === 0;

  if (sameDenom) {
    const den = getRandomInt(3, 9);
    const num1 = getRandomInt(1, 5);
    const num2 = getRandomInt(1, 5);

    const sumNum = num1 + num2;
    const simplified = simplifyFraction(sumNum, den);
    const correctStr = fractionToString(simplified);

    // Opciones
    const wrong1 = `${num1 + num2}/${den + den}`; // error clásico de sumar denominadores
    const wrong2 = `${num1 * num2}/${den}`;
    const wrong3 = `${sumNum + 1}/${den}`;
    const options = shuffleArray(Array.from(new Set([correctStr, wrong1, wrong2, wrong3])));

    return {
      id: `l3_${index}_${Date.now()}`,
      type: 'multiple-choice',
      prompt: `Calcula la suma de fracciones con igual denominador:`,
      subPrompt: `Suma:  ${num1}/${den}  +  ${num2}/${den}`,
      options,
      correctAnswer: correctStr,
      explanationStepByStep: [
        `1. Como tienen igual denominador (${den}), mantenemos el denominador intacto.`,
        `2. Sumamos los numeradores: ${num1} + ${num2} = ${sumNum}.`,
        `3. Resultado: ${sumNum}/${den}.` + (simplified.denominator !== den ? ` Simplificado a su forma irreductible: ${correctStr}.` : '')
      ]
    };
  } else {
    // Distinto denominador
    const den1 = getRandomInt(2, 5);
    const num1 = getRandomInt(1, 3);
    let den2 = getRandomInt(2, 5);
    if (den1 === den2) den2 += 1;
    const num2 = getRandomInt(1, 3);

    const commonDen = lcm(den1, den2);
    const newNum1 = num1 * (commonDen / den1);
    const newNum2 = num2 * (commonDen / den2);
    const sumNum = newNum1 + newNum2;

    const simplified = simplifyFraction(sumNum, commonDen);
    const correctStr = fractionToString(simplified);

    // Opciones engañosas
    const wrongSumDenom = `${num1 + num2}/${den1 + den2}`; // error muy común
    const wrongDirectNum = `${num1 + num2}/${commonDen}`;
    const wrongProd = `${num1 * num2}/${den1 * den2}`;
    const options = shuffleArray(Array.from(new Set([correctStr, wrongSumDenom, wrongDirectNum, wrongProd])));

    return {
      id: `l3_${index}_${Date.now()}`,
      type: 'multiple-choice',
      prompt: `Calcula la suma con diferente denominador:`,
      subPrompt: `Suma:  ${num1}/${den1}  +  ${num2}/${den2}`,
      options,
      correctAnswer: correctStr,
      explanationStepByStep: [
        `1. Hallamos el denominador común (m.c.m. entre ${den1} y ${den2}) = ${commonDen}.`,
        `2. Convertimos las fracciones:`,
        `   • ${num1}/${den1} = ${newNum1}/${commonDen}`,
        `   • ${num2}/${den2} = ${newNum2}/${commonDen}`,
        `3. Sumamos los nuevos numeradores: ${newNum1} + ${newNum2} = ${sumNum}/${commonDen}.`,
        `4. Simplificado: ${correctStr}. ¡RECUERDA NUNCA sumar los denominadores directamente!`
      ]
    };
  }
}

// ---------------- LEVEL 4: Resta de Fracciones ----------------
function generateLevel4Question(index: number): Question {
  const sameDenom = index % 2 === 0;

  if (sameDenom) {
    const den = getRandomInt(4, 10);
    const num1 = getRandomInt(3, den + 2);
    const num2 = getRandomInt(1, num1 - 1);

    const diffNum = num1 - num2;
    const simplified = simplifyFraction(diffNum, den);
    const correctStr = fractionToString(simplified);

    const wrong1 = `${num1 - num2}/${den - den}`;
    const wrong2 = `${num1 + num2}/${den}`;
    const wrong3 = `${diffNum + 1}/${den}`;
    const options = shuffleArray(Array.from(new Set([correctStr, wrong1, wrong2, wrong3])));

    return {
      id: `l4_${index}_${Date.now()}`,
      type: 'multiple-choice',
      prompt: `Resta las siguientes fracciones de igual denominador:`,
      subPrompt: `Resuelve:  ${num1}/${den}  -  ${num2}/${den}`,
      options,
      correctAnswer: correctStr,
      explanationStepByStep: [
        `1. Como tienen igual denominador (${den}), se mantiene el denominador.`,
        `2. Restamos los numeradores: ${num1} - ${num2} = ${diffNum}.`,
        `3. Resultado: ${diffNum}/${den}.` + (simplified.denominator !== den ? ` Simplificando: ${correctStr}.` : '')
      ]
    };
  } else {
    // Distinto denominador
    const den1 = getRandomInt(2, 6);
    const num1 = getRandomInt(2, 5);
    let den2 = getRandomInt(2, 6);
    if (den1 === den2) den2 += 1;

    // Asegurar que la primera fracción sea mayor para evitar resultados negativos
    let f1Val = num1 / den1;
    let num2 = getRandomInt(1, 3);
    let f2Val = num2 / den2;

    if (f1Val <= f2Val) {
      num2 = 1;
      f2Val = 1 / den2;
    }

    const commonDen = lcm(den1, den2);
    const newNum1 = num1 * (commonDen / den1);
    const newNum2 = num2 * (commonDen / den2);
    const diffNum = Math.max(1, newNum1 - newNum2);

    const simplified = simplifyFraction(diffNum, commonDen);
    const correctStr = fractionToString(simplified);

    const wrong1 = `${Math.abs(num1 - num2)}/${Math.abs(den1 - den2) || 1}`;
    const wrong2 = `${newNum1 - newNum2}/${den1 * den2}`;
    const wrong3 = `${diffNum + 1}/${commonDen}`;
    const options = shuffleArray(Array.from(new Set([correctStr, wrong1, wrong2, wrong3])));

    return {
      id: `l4_${index}_${Date.now()}`,
      type: 'multiple-choice',
      prompt: `Resuelve la resta con distinto denominador:`,
      subPrompt: `Resta:  ${num1}/${den1}  -  ${num2}/${den2}`,
      options,
      correctAnswer: correctStr,
      explanationStepByStep: [
        `1. Mínimo común múltiplo m.c.m.(${den1}, ${den2}) = ${commonDen}.`,
        `2. Convertimos a fracciones equivalentes:`,
        `   • ${num1}/${den1} = ${newNum1}/${commonDen}`,
        `   • ${num2}/${den2} = ${newNum2}/${commonDen}`,
        `3. Restamos numeradores: ${newNum1} - ${newNum2} = ${diffNum}/${commonDen}.`,
        `4. Forma simplificada final: ${correctStr}.`
      ]
    };
  }
}

// ---------------- LEVEL 5: Multiplicación de Fracciones ----------------
function generateLevel5Question(index: number): Question {
  const isFractionByInteger = index % 3 === 2;

  if (isFractionByInteger) {
    const intVal = getRandomInt(2, 6);
    const num = getRandomInt(1, 4);
    const den = getRandomInt(3, 7);

    const prodNum = intVal * num;
    const simplified = simplifyFraction(prodNum, den);
    const correctStr = fractionToString(simplified);

    const wrong1 = `${intVal * num}/${intVal * den}`;
    const wrong2 = `${intVal + num}/${den}`;
    const wrong3 = `${prodNum + 1}/${den}`;
    const options = shuffleArray(Array.from(new Set([correctStr, wrong1, wrong2, wrong3])));

    return {
      id: `l5_${index}_${Date.now()}`,
      type: 'multiple-choice',
      prompt: `Multiplica el entero por la fracción:`,
      subPrompt: `Calcula:  ${intVal}  ×  ${num}/${den}`,
      options,
      correctAnswer: correctStr,
      explanationStepByStep: [
        `1. Escribimos el número entero como fracción con denominador 1: ${intVal}/1.`,
        `2. Multiplicamos numeradores entre sí: ${intVal} × ${num} = ${prodNum}.`,
        `3. Multiplicamos denominadores entre sí: 1 × ${den} = ${den}.`,
        `4. Obtenemos ${prodNum}/${den}. Simplificado: ${correctStr}.`
      ]
    };
  } else {
    const num1 = getRandomInt(1, 5);
    const den1 = getRandomInt(2, 6);
    const num2 = getRandomInt(1, 5);
    const den2 = getRandomInt(2, 6);

    const prodNum = num1 * num2;
    const prodDen = den1 * den2;

    const simplified = simplifyFraction(prodNum, prodDen);
    const correctStr = fractionToString(simplified);

    const wrongCross = `${num1 * den2}/${den1 * num2}`; // error de cruce
    const wrongAdd = `${num1 + num2}/${den1 + den2}`; // error de sumar
    const wrong1 = `${prodNum}/${den1 + den2}`;
    const options = shuffleArray(Array.from(new Set([correctStr, wrongCross, wrongAdd, wrong1])));

    return {
      id: `l5_${index}_${Date.now()}`,
      type: 'multiple-choice',
      prompt: `Resuelve la multiplicación de fracciones:`,
      subPrompt: `Multiplica:  ${num1}/${den1}  ×  ${num2}/${den2}`,
      options,
      correctAnswer: correctStr,
      explanationStepByStep: [
        `1. ¡La multiplicación de fracciones es DIRECTA!`,
        `2. Numerador × Numerador: ${num1} × ${num2} = ${prodNum}.`,
        `3. Denominador × Denominador: ${den1} × ${den2} = ${prodDen}.`,
        `4. Fracción sin simplificar: ${prodNum}/${prodDen}.`,
        `5. Simplificando por su MCD: ${correctStr}.`
      ]
    };
  }
}

// ---------------- LEVEL 6: División de Fracciones ----------------
function generateLevel6Question(index: number): Question {
  const num1 = getRandomInt(1, 5);
  const den1 = getRandomInt(2, 6);
  const num2 = getRandomInt(1, 5);
  const den2 = getRandomInt(2, 6);

  // División: (num1/den1) / (num2/den2) = (num1 * den2) / (den1 * num2)
  const divNum = num1 * den2;
  const divDen = den1 * num2;

  const simplified = simplifyFraction(divNum, divDen);
  const correctStr = fractionToString(simplified);

  const wrongDirect = `${num1 * num2}/${den1 * den2}`; // error de multiplicar directo en vez de dividir
  const wrongInvert1 = `${den1 * num2}/${num1 * den2}`;
  const wrongSub = `${Math.abs(num1 - num2)}/${Math.abs(den1 - den2) || 1}`;

  const options = shuffleArray(Array.from(new Set([correctStr, wrongDirect, wrongInvert1, wrongSub])));

  return {
    id: `l6_${index}_${Date.now()}`,
    type: 'multiple-choice',
    prompt: `Resuelve la división de fracciones:`,
    subPrompt: `Divide:  ${num1}/${den1}  ÷  ${num2}/${den2}`,
    options,
    correctAnswer: correctStr,
    explanationStepByStep: [
      `1. Método 1 (Multiplicación en cruz / Orestes):`,
      `   • Numerador nuevo: ${num1} × ${den2} = ${divNum}`,
      `   • Denominador nuevo: ${den1} × ${num2} = ${divDen}`,
      `2. Método 2 (Invertir y multiplicar): ${num1}/${den1} × ${den2}/${num2} = ${divNum}/${divDen}.`,
      `3. Simplificando la fracción resultante: ${correctStr}.`
    ]
  };
}
