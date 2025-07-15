"use client"

import React, { useState } from "react"
import Image from "next/image"
import { CheckCircle, Circle, BarChart3, Target, Cpu, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Coloque aqui sua URL do webhook do Google Sheets
const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxjEh0Uyb4tmqlk2d3etfUZg1zMm7w6-N7ShZEUMB6OrNzmcAIQRng6xqvEJBwSeEwh/exec"

const CXMaturityQuiz = () => {
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: boolean }>({})
  const [showResults, setShowResults] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    companyName: "",
  })
  const [isSending, setIsSending] = useState(false)

  const sections = [
    {
      title: "ESTRATÉGIA",
      icon: <Target className="w-6 h-6" />,
      questions: [
        "O CX da sua empresa está integrado ao planejamento estratégico?",
        "Existem métricas específicas de experiência atreladas a resultados de negócio?",
        "Todas as lideranças de empresa participam de decisões sobre CX?",
      ],
    },
    {
      title: "OPERAÇÃO",
      icon: <BarChart3 className="w-6 h-6" />,
      questions: [
        "Dados de diferentes touchpoints são integrados em visão única do cliente?",
        "Há equipes multiciplinares de CX ou há apenas um departamento com essa atribuição?",
        "Os processos são desenhados a partir da perspectiva do cliente?",
      ],
    },
    {
      title: "TECNOLOGIA",
      icon: <Cpu className="w-6 h-6" />,
      questions: [
        "Sua empresa possui  plataformas que permitem personalização de soluções em escala para seus clientes?",
        "Há aplicação de IA para permitir antecipação às necessidades dos clientes?",
        "As automações de atendimento preservam a  humanização em momentos críticos?",
      ],
    },
    {
      title: "CULTURA",
      icon: <Users className="w-6 h-6" />,
      questions: [
        "A empresa possui programas de capacitação multi departamentais para CX?",
        "Há programa de escuta ativa compartilhado entre vários canais?",
        "Inovação em CX é incentivada e recompensada?",
      ],
    },
  ]

  const maturityLevels = [
    {
      level: "REATIVO",
      range: "0-3 SIM",
      color: "from-red-500 to-red-600",
      icon: "🔴",
      description: "Sua marca responde a problemas ao invés de antecipar necessidades.",
      recommendation: "Priorize trilhas de Fundamentos CX e Estratégia no CONAREC",
      focus: "Estabelecer bases sólidas e visão integrada",
    },
    {
      level: "ESTRUTURADO",
      range: "4-6 SIM",
      color: "from-yellow-500 to-yellow-600",
      icon: "🟡",
      description: "Processos existem mas falta integração e visão sistêmica.",
      recommendation: "Explore trilhas de Tecnologia CX e Transformação Digital",
      focus: "Integrar touchpoints e otimizar jornadas",
    },
    {
      level: "OTIMIZADO",
      range: "7-9 SIM",
      color: "from-green-500 to-green-600",
      icon: "🟢",
      description: "CX é prioridade mas ainda há potencial de diferenciação.",
      recommendation: "Participe das trilhas de Inovação e Liderança CX",
      focus: "Criar vantagens competitivas sustentáveis",
    },
    {
      level: "TRANSFORMADOR",
      range: "10-12 SIM",
      color: "from-blue-500 to-blue-600",
      icon: "🔵",
      description: "Sua marca define padrões de mercado em experiência.",
      recommendation: "Lidere discussões nas trilhas de Visão Global e Futuro CX",
      focus: "Compartilhar expertise e moldar tendências",
    },
  ]

  const handleAnswer = (questionIndex: number, value: boolean) => {
    const globalQuestionIndex = currentSection * 3 + questionIndex
    setAnswers((prev) => ({
      ...prev,
      [globalQuestionIndex]: value,
    }))
  }

  const getScore = () => {
    return Object.values(answers).filter((answer) => answer === true).length
  }

  const getMaturityLevel = () => {
    const score = getScore()
    if (score <= 3) return maturityLevels[0]
    if (score <= 6) return maturityLevels[1]
    if (score <= 9) return maturityLevels[2]
    return maturityLevels[3]
  }

  const canProceed = () => {
    const sectionStart = currentSection * 3
    const sectionEnd = sectionStart + 3
    for (let i = sectionStart; i < sectionEnd; i++) {
      if (answers[i] === undefined) return false
    }
    return true
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    } else {
      setShowResults(true)
    }
  }

  const restartQuiz = () => {
    setCurrentSection(0)
    setAnswers({})
    setShowResults(false)
    setShowForm(true) // Go back to the form
    setFormData({ name: "", email: "", whatsapp: "", companyName: "" })
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // Função para enviar dados para Google Sheets via webhook
  async function sendResultsToSheet(data: unknown) {
    setIsSending(true)
    try {
      const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        console.error("Erro ao enviar dados para Google Sheets:", response.statusText)
      } else {
        console.log("Dados enviados com sucesso para o Google Sheets!")
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error)
    }
    setIsSending(false)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Monta o objeto com os dados para enviar
    const payload = {
      date: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      companyName: formData.companyName,
      answers,
      score: getScore(),
      maturityLevel: getMaturityLevel().level,
    }

    console.log("Formulário enviado:", payload)
    sendResultsToSheet(payload)
    setShowForm(false)
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-[#0043FF] p-4 flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
          {/* Header with Logo and Text */}
          <div className="flex items-center justify-center md:justify-start w-full mb-8 px-4">
            <Image src="/logo-conarec.png" alt="Logo Conarec" width={150} height={40} className="h-10 w-auto mr-6" />
            <p className="text-white text-lg md:text-xl font-semibold text-center md:text-left max-w-2xl">
              Descubra se o CX de sua empresa gera valor real para seus consumidores. Informe seus dados abaixo e
              responda o quiz:
            </p>
          </div>

          {/* Form Card */}
          <Card className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" type="text" value={formData.name} onChange={handleFormChange} required />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleFormChange} required />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp com DDD</Label>
                  <Input id="whatsapp" type="tel" value={formData.whatsapp} onChange={handleFormChange} required />
                </div>
                <div>
                  <Label htmlFor="companyName">Nome da empresa</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[#05D305] hover:bg-[#04B004] text-white"
                >
                  {isSending ? "Enviando..." : "Iniciar Quiz"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showResults) {
    const score = getScore()
    const maturityLevel = getMaturityLevel()

    return (
      <div className="min-h-screen bg-[#0043FF] p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <Image src="/logo-conarec.png" alt="Logo Conarec" width={200} height={60} className="mx-auto h-16 w-auto" />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center">
            <div
              className={`inline-block px-6 py-3 bg-gradient-to-r ${maturityLevel.color} rounded-full text-white text-xl font-bold mb-3`}
            >
              <span className="text-2xl mr-2">{maturityLevel.icon}</span>
              {maturityLevel.level}
            </div>
            <div className="text-3xl font-bold text-[#0043FF] mb-2">{score}/12</div>
            <p className="text-gray-600 text-base mb-4">({maturityLevel.range})</p>
            <p className="text-gray-700 text-base leading-relaxed">{maturityLevel.description}</p>
            <p className="text-gray-700 text-base leading-relaxed mt-3">
              Foco de Desenvolvimento: {maturityLevel.focus}
            </p>
          </div>
          {/* Score Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Análise por Dimensão</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {sections.map((section, sectionIndex) => {
                const sectionScore = [0, 1, 2].reduce((acc, questionIndex) => {
                  const globalIndex = sectionIndex * 3 + questionIndex
                  return acc + (answers[globalIndex] ? 1 : 0)
                }, 0)

                return (
                  <div key={sectionIndex} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-center mb-2 text-[#0043FF]">{section.icon}</div>
                    <h4 className="font-bold text-gray-800 mb-2">{section.title}</h4>
                    <div className="text-2xl font-bold text-[#0043FF]">{sectionScore}/3</div>
                  </div>
                )
              })}
            </div>
          </div>
          {/* Call to Action */}
          <div className="bg-white rounded-xl p-8 text-center text-gray-800">
            <h3 className="text-2xl font-bold mb-4">Evolua o nível de maturidade CX da sua marca</h3>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
              No CONAREC 2025, maturidade organizacional evolui através de networking estratégico, insights aplicáveis e
              exposição a práticas de referência mundial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={restartQuiz}
                className="px-6 py-3 bg-[#05D305] text-white rounded-lg font-medium hover:bg-[#04B004] transition-colors"
              >
                Refazer Assessment
              </Button>
              <Button
                onClick={() => window.open("https://conarec.com.br", "_blank")}
                className="px-6 py-3 bg-[#05D305] text-white rounded-lg font-medium hover:bg-[#04B004] transition-colors"
              >
                Descobrir Trilhas CONAREC
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0043FF] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Logo - Centralized */}
        <div className="text-center mb-8">
          <Image src="/logo-conarec.png" alt="Logo Conarec" width={150} height={40} className="mx-auto h-10 w-auto" />
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-white">
              Seção {currentSection + 1} de {sections.length}
            </span>
            <span className="text-sm text-white">
              {(((currentSection + 1) / sections.length) * 100).toFixed(0)}% Completo
            </span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Quiz Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-[#0043FF] rounded-full flex items-center justify-center mr-4">
              {React.cloneElement(sections[currentSection].icon, { className: "w-6 h-6 text-white" })}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{sections[currentSection].title}</h3>
          </div>
          <div className="space-y-6">
            {sections[currentSection].questions.map((question, questionIndex) => {
              const globalQuestionIndex = currentSection * 3 + questionIndex
              const answer = answers[globalQuestionIndex]

              return (
                <div key={questionIndex} className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-xl md:text-2xl font-medium text-gray-800 mb-4">
                    {currentSection * 3 + questionIndex + 1}. {question}
                  </h4>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAnswer(questionIndex, true)}
                      className={`flex items-center px-6 py-3 rounded-lg border-2 transition-all text-lg ${
                        answer === true
                          ? "border-[#05D305] bg-[#05D305]/10 text-[#05D305]"
                          : "border-gray-200 hover:border-[#05D305]/50 text-gray-600"
                      }`}
                    >
                      {answer === true ? <CheckCircle className="w-5 h-5 mr-2" /> : <Circle className="w-5 h-5 mr-2" />}
                      SIM
                    </button>

                    <button
                      onClick={() => handleAnswer(questionIndex, false)}
                      className={`flex items-center px-6 py-3 rounded-lg border-2 transition-all text-lg ${
                        answer === false
                          ? "border-red-500 bg-red-500/10 text-red-700"
                          : "border-gray-200 hover:border-red-300 text-gray-600"
                      }`}
                    >
                      {answer === false ? (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      ) : (
                        <Circle className="w-5 h-5 mr-2" />
                      )}
                      NÃO
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className="px-6 py-3 text-white border border-white rounded-lg font-medium hover:bg-white hover:text-[#0043FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </Button>

            <Button
              onClick={nextSection}
              disabled={!canProceed()}
              className="px-8 py-3 bg-[#05D305] hover:bg-[#04B004] text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentSection === sections.length - 1 ? "Ver Resultado" : "Próxima Seção"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CXMaturityQuiz
