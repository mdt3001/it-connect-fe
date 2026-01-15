"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Download } from "lucide-react"
import jsPDF from "jspdf"

function CreateCV() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        website: "",
        summary: "",
        experiences: [{ title: "", company: "", period: "", description: "" }],
        educations: [{ degree: "", school: "", period: "" }],
        skills: "",
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleArrayChange = (index, field, value, arrayName) => {
        setFormData((prev) => {
            const newArray = [...prev[arrayName]]
            newArray[index][field] = value
            return { ...prev, [arrayName]: newArray }
        })
    }

    const addItem = (arrayName) => {
        setFormData((prev) => ({
            ...prev,
            [arrayName]: [
                ...prev[arrayName],
                arrayName === "experiences"
                    ? { title: "", company: "", period: "", description: "" }
                    : { degree: "", school: "", period: "" },
            ],
        }))
    }

    const generatePDF = () => {
        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const margins = { left: 20, right: 20, top: 15, bottom: 15 }
        let yPosition = margins.top

        // Header with name
        doc.setFont("helvetica", "bold")
        doc.setFontSize(22)
        doc.text((formData.name || "YOUR NAME").toUpperCase(), margins.left, yPosition)
        yPosition += 8

        // Contact info
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        const contactInfo = [formData.email, formData.phone, formData.website].filter(Boolean).join(" – ")
        doc.text(contactInfo || "email@example.com – +84 ... – website.com", margins.left, yPosition)
        yPosition += 7

        doc.setDrawColor(180, 180, 180)
        doc.line(margins.left, yPosition, pageWidth - margins.right, yPosition)
        yPosition += 8

        // Summary section
        if (formData.summary) {
            doc.setFont("helvetica", "bold")
            doc.setFontSize(11)
            doc.text("SUMMARY", margins.left, yPosition)
            yPosition += 6

            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            const summaryLines = doc.splitTextToSize(formData.summary, pageWidth - margins.left - margins.right)
            doc.text(summaryLines, margins.left, yPosition)
            yPosition += summaryLines.length * 5 + 8

            doc.setDrawColor(200, 200, 200)
            doc.line(margins.left, yPosition, pageWidth - margins.right, yPosition)
            yPosition += 8
        }

        // Professional Skills section
        if (formData.skills) {
            doc.setFont("helvetica", "bold")
            doc.setFontSize(11)
            doc.text("PROFESSIONAL SKILLS", margins.left, yPosition)
            yPosition += 6

            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            const skillLines = doc.splitTextToSize(formData.skills, pageWidth - margins.left - margins.right)
            doc.text(skillLines, margins.left, yPosition)
            yPosition += skillLines.length * 5 + 8

            doc.setDrawColor(200, 200, 200)
            doc.line(margins.left, yPosition, pageWidth - margins.right, yPosition)
            yPosition += 8
        }

        // Work Experience section
        if (formData.experiences.some((e) => e.title || e.company)) {
            doc.setFont("helvetica", "bold")
            doc.setFontSize(11)
            doc.text("WORK EXPERIENCE", margins.left, yPosition)
            yPosition += 6

            formData.experiences.forEach((exp) => {
                if (exp.title || exp.company) {
                    doc.setFont("helvetica", "bold")
                    doc.setFontSize(10)
                    doc.text(`${exp.title || "Position"}`, margins.left, yPosition)
                    yPosition += 5

                    doc.setFont("helvetica", "normal")
                    doc.setFontSize(9)
                    const companyLine = `${exp.company || "Company"}${exp.period ? " — " + exp.period : ""}`
                    doc.text(companyLine, margins.left, yPosition)
                    yPosition += 5

                    if (exp.description) {
                        const descLines = doc.splitTextToSize("• " + exp.description, pageWidth - margins.left - margins.right - 5)
                        doc.setFont("helvetica", "normal")
                        doc.setFontSize(9)
                        doc.text(descLines, margins.left + 5, yPosition)
                        yPosition += descLines.length * 4 + 5
                    }
                    yPosition += 2
                }
            })
            yPosition += 4

            doc.setDrawColor(200, 200, 200)
            doc.line(margins.left, yPosition, pageWidth - margins.right, yPosition)
            yPosition += 8
        }

        // Education section
        if (formData.educations.some((e) => e.degree || e.school)) {
            doc.setFont("helvetica", "bold")
            doc.setFontSize(11)
            doc.text("EDUCATION & CERTIFICATIONS", margins.left, yPosition)
            yPosition += 6

            formData.educations.forEach((edu) => {
                if (edu.degree || edu.school) {
                    doc.setFont("helvetica", "bold")
                    doc.setFontSize(10)
                    doc.text(edu.degree || "Degree", margins.left, yPosition)
                    yPosition += 5

                    doc.setFont("helvetica", "normal")
                    doc.setFontSize(9)
                    const schoolLine = `${edu.school || "School"}${edu.period ? " — " + edu.period : ""}`
                    doc.text(schoolLine, margins.left, yPosition)
                    yPosition += 6
                }
            })
        }

        doc.save("MyCV.pdf")
    }

    return (
        <div className="min-h-screen bg-white">
            <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between z-10">
                <h1 className="text-2xl font-light tracking-wide text-gray-900">Tạo CV Tự Động</h1>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                >
                    Quay lại
                </button>
            </nav>

            <div className="pt-20 pb-16 px-6 sm:px-8 lg:px-12 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                {/* Left: Form */}
                <div className="lg:w-1/2 space-y-8">
                    <h2 className="text-3xl font-light tracking-wide text-gray-900">Điền thông tin</h2>

                    {/* Personal Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Thông tin cá nhân</h3>
                        <input
                            name="name"
                            placeholder="Họ và tên"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                        />
                        <input
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                        />
                        <input
                            name="phone"
                            placeholder="Số điện thoại"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                        />
                        <input
                            name="website"
                            placeholder="Website/LinkedIn"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                        />
                    </div>

                    {/* Summary */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Tóm tắt</h3>
                        <textarea
                            name="summary"
                            placeholder="Tóm tắt về bản thân (không bắt buộc)"
                            value={formData.summary}
                            onChange={handleInputChange}
                            className="w-full px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all h-24"
                        />
                    </div>

                    {/* Experience */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Kinh nghiệm</h3>
                        {formData.experiences.map((exp, index) => (
                            <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <input
                                    placeholder="Chức vụ"
                                    value={exp.title}
                                    onChange={(e) => handleArrayChange(index, "title", e.target.value, "experiences")}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-blue-500"
                                />
                                <input
                                    placeholder="Công ty"
                                    value={exp.company}
                                    onChange={(e) => handleArrayChange(index, "company", e.target.value, "experiences")}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-blue-500"
                                />
                                <input
                                    placeholder="Thời gian (ví dụ: 2020-2023)"
                                    value={exp.period}
                                    onChange={(e) => handleArrayChange(index, "period", e.target.value, "experiences")}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-blue-500"
                                />
                                <textarea
                                    placeholder="Mô tả"
                                    value={exp.description}
                                    onChange={(e) => handleArrayChange(index, "description", e.target.value, "experiences")}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-blue-500 h-20"
                                />
                            </div>
                        ))}
                        <button
                            onClick={() => addItem("experiences")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                            + Thêm kinh nghiệm
                        </button>
                    </div>

                    {/* Education */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Học vấn</h3>
                        {formData.educations.map((edu, index) => (
                            <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <input
                                    placeholder="Bằng cấp"
                                    value={edu.degree}
                                    onChange={(e) => handleArrayChange(index, "degree", e.target.value, "educations")}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-blue-500"
                                />
                                <input
                                    placeholder="Trường học"
                                    value={edu.school}
                                    onChange={(e) => handleArrayChange(index, "school", e.target.value, "educations")}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-blue-500"
                                />
                                <input
                                    placeholder="Thời gian"
                                    value={edu.period}
                                    onChange={(e) => handleArrayChange(index, "period", e.target.value, "educations")}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-blue-500"
                                />
                            </div>
                        ))}
                        <button
                            onClick={() => addItem("educations")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                            + Thêm học vấn
                        </button>
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Kỹ năng</h3>
                        <textarea
                            name="skills"
                            placeholder="Kỹ năng (cách nhau bởi dấu phẩy hoặc dòng mới)"
                            value={formData.skills}
                            onChange={handleInputChange}
                            className="w-full px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all h-24"
                        />
                    </div>

                    <button
                        onClick={generatePDF}
                        className="w-full px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        Xuất PDF
                    </button>
                </div>

                {/* Right: Preview */}
                <div className="lg:w-1/2 bg-white border border-gray-300 rounded-2xl p-12 overflow-auto sticky top-24 h-[calc(100vh-6rem)] shadow-sm">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{(formData.name || "YOUR NAME").toUpperCase()}</h1>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-6">
                        {formData.email && <span>{formData.email}</span>}
                        {formData.phone && <span>•</span>}
                        {formData.phone && <span>{formData.phone}</span>}
                        {formData.website && <span>•</span>}
                        {formData.website && <span>{formData.website}</span>}
                    </div>

                    <hr className="border-gray-400 mb-6" />

                    {formData.summary && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-900 mb-3">SUMMARY</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">{formData.summary}</p>
                        </div>
                    )}

                    {formData.skills && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-900 mb-3">PROFESSIONAL SKILLS</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">{formData.skills}</p>
                        </div>
                    )}

                    {formData.experiences.some((e) => e.title || e.company) && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">WORK EXPERIENCE</h3>
                            {formData.experiences.map(
                                (exp, index) =>
                                    (exp.title || exp.company) && (
                                        <div key={index} className="mb-4">
                                            <h4 className="text-sm font-bold text-gray-900">{exp.title || "Position"}</h4>
                                            <p className="text-sm text-gray-700">
                                                {exp.company || "Company"}
                                                {exp.period && ` — ${exp.period}`}
                                            </p>
                                            {exp.description && <p className="text-sm text-gray-700 mt-1">{exp.description}</p>}
                                        </div>
                                    ),
                            )}
                        </div>
                    )}

                    {formData.educations.some((e) => e.degree || e.school) && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4">EDUCATION & CERTIFICATIONS</h3>
                            {formData.educations.map(
                                (edu, index) =>
                                    (edu.degree || edu.school) && (
                                        <div key={index} className="mb-3">
                                            <h4 className="text-sm font-bold text-gray-900">{edu.degree || "Degree"}</h4>
                                            <p className="text-sm text-gray-700">
                                                {edu.school || "School"}
                                                {edu.period && ` — ${edu.period}`}
                                            </p>
                                        </div>
                                    ),
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateCV
