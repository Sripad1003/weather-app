// "use client"
// import { useState } from "react"
// import "../src/styles/global.css"
// export default function Feedback() {
//   const [feedbackOpen, setFeedbackOpen] = useState(false)
//   const [feedback, setFeedback] = useState({ name: '', email: '', message: '' })

//   const handleFeedbackSubmit = (e) => {
//     e.preventDefault()
//     console.log('Feedback submitted:', feedback)
//     alert('Thank you for your feedback!')
//     setFeedback({ name: '', email: '', message: '' })
//     setFeedbackOpen(false)
//   }

//   return (
//     <>
//       <button
//         className="fixed bottom-4 right-4 rounded-full p-3 shadow-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 hover:scale-110"
//         onClick={() => setFeedbackOpen(true)}
//         aria-label="Open feedback form"
//       >
//         💬
//       </button>

//       {feedbackOpen && (
//         <>
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={() => setFeedbackOpen(false)}
//             aria-hidden="true"
//           ></div>
//           <div
//             className="fixed bottom-20 right-4 bg-white p-6 rounded-xl shadow-2xl max-w-md w-full z-50 border border-gray-200 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
//             onClick={(e) => e.stopPropagation()}
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="feedback-title"
//           >
//           <h2 id="feedback-title" className="text-lg font-semibold mb-4 text-gray-800">Feedback</h2>
//           <form onSubmit={handleFeedbackSubmit}>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Your Name"
//                 value={feedback.name}
//                 onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
//                 className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               />
//               <input
//                 type="email"
//                 placeholder="Your Email"
//                 value={feedback.email}
//                 onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
//                 className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               />
//               <textarea
//                 placeholder="Your Message"
//                 value={feedback.message}
//                 onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
//                 className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                 rows="4"
//                 required
//               />
//             </div>
//             <div className="flex justify-end mt-6 space-x-2">
//               <button
//                 type="button"
//                 onClick={() => setFeedbackOpen(false)}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//         </>
//       )}
//     </>
//   )
// }
