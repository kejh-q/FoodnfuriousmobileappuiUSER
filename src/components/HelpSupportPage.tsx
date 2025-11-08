import { motion } from "motion/react";
import { ArrowLeft, HelpCircle, MessageCircle, Mail, Phone, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";

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
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [reportSubject, setReportSubject] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const handleLiveChat = () => {
    setShowChatDialog(true);
  };

  const handleSendChat = () => {
    if (!chatMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    toast.success("Message sent! Our team will respond shortly.");
    setChatMessage("");
    setShowChatDialog(false);
  };

  const handleEmailSupport = () => {
    window.location.href = "mailto:support@umeats.my";
  };

  const handlePhoneSupport = () => {
    window.location.href = "tel:+60379677022";
  };

  const handleReportIssue = () => {
    setShowReportDialog(true);
  };

  const handleSubmitReport = () => {
    if (!reportSubject.trim() || !reportDescription.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Issue reported successfully! We'll get back to you soon.");
    setReportSubject("");
    setReportDescription("");
    setShowReportDialog(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-gray-900 pb-20 transition-colors duration-300"
    >
      {/* Header */}
      <div className="bg-[#FFD60A] dark:bg-yellow-600 px-6 pt-12 pb-6 transition-colors duration-300">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => onNavigate("profile")} className="text-gray-900 dark:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-gray-900 dark:text-white">Help & Support</h1>
        </div>
      </div>

      {/* Contact Options */}
      <div className="px-6 mt-6">
        <h3 className="text-gray-900 dark:text-white mb-4">Contact Us</h3>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden mb-6 transition-colors duration-300">
          <button 
            onClick={handleLiveChat}
            className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-gray-900 dark:text-white">Live Chat</h3>
              <p className="text-gray-600 dark:text-gray-400">Chat with our support team</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </button>

          <button 
            onClick={handleEmailSupport}
            className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-gray-900 dark:text-white">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">support@umeats.my</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </button>

          <button 
            onClick={handlePhoneSupport}
            className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-gray-900 dark:text-white">Phone</h3>
              <p className="text-gray-600 dark:text-gray-400">+60 3-7967 7022</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </button>
        </div>

        {/* FAQs */}
        <h3 className="text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 p-4 transition-colors duration-300"
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#FFD60A] dark:bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Report Issue Button */}
        <div className="mt-6">
          <Button 
            onClick={handleReportIssue}
            className="w-full h-14 bg-[#FFD60A] dark:bg-yellow-600 hover:bg-[#FFC700] dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl"
          >
            Report an Issue
          </Button>
        </div>
      </div>

      {/* Live Chat Dialog */}
      <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Live Chat</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Send us a message and we'll get back to you shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chat-message" className="text-gray-900 dark:text-white">Your Message</Label>
              <Textarea
                id="chat-message"
                placeholder="Type your message here..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="min-h-[120px] dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => setShowChatDialog(false)}
              variant="outline"
              className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendChat}
              className="flex-1 bg-[#FFD60A] hover:bg-[#FFC700] dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white"
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Issue Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Report an Issue</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Describe the issue you're experiencing and we'll help resolve it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="report-subject" className="text-gray-900 dark:text-white">Subject</Label>
              <Input
                id="report-subject"
                placeholder="Brief description of the issue"
                value={reportSubject}
                onChange={(e) => setReportSubject(e.target.value)}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-description" className="text-gray-900 dark:text-white">Description</Label>
              <Textarea
                id="report-description"
                placeholder="Please provide more details about the issue..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                className="min-h-[120px] dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => setShowReportDialog(false)}
              variant="outline"
              className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReport}
              className="flex-1 bg-[#FFD60A] hover:bg-[#FFC700] dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white"
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
