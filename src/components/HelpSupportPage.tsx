import { motion } from "motion/react";
import { ArrowLeft, HelpCircle, MessageCircle, Mail, Phone, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface HelpSupportPageProps {
  onNavigate: (page: string) => void;
}

const faqs = [
  {
    id: 1,
    question: "How do I track my order?",
    answer: "Once your order is confirmed, you'll be able to track it in real-time from the tracking page.",
  },
  {
    id: 2,
    question: "What are the delivery charges?",
    answer: "Delivery charges vary based on your location within UM campus. Usually RM 2-5.",
  },
  {
    id: 3,
    question: "Can I cancel my order?",
    answer: "You can cancel your order before the driver picks it up from the restaurant.",
  },
  {
    id: 4,
    question: "What payment methods are accepted?",
    answer: "We accept credit/debit cards and major e-wallets like Touch 'n Go.",
  },
];

export function HelpSupportPage({ onNavigate }: HelpSupportPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pb-20"
    >
      {/* Header */}
      <div className="bg-[#FFD60A] px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => onNavigate("profile")} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-gray-900">Help & Support</h1>
        </div>
      </div>

      {/* Contact Options */}
      <div className="px-6 mt-6">
        <h3 className="text-gray-900 mb-4">Contact Us</h3>
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden mb-6">
          <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-gray-900">Live Chat</h3>
              <p className="text-gray-600">Chat with our support team</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-gray-900">Email</h3>
              <p className="text-gray-600">support@umeats.my</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-gray-900">Phone</h3>
              <p className="text-gray-600">+60 3-7967 7022</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* FAQs */}
        <h3 className="text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border-2 border-gray-100 p-4"
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#FFD60A] rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Report Issue Button */}
        <div className="mt-6">
          <Button className="w-full h-14 bg-[#FFD60A] hover:bg-[#FFC700] text-gray-900 rounded-xl">
            Report an Issue
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
