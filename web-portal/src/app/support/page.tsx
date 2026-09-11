// ============================================
// VERVE AI - Support Page
// ============================================

'use client'

import * as React from 'react'
import { PublicLayout } from '@/components/public'
import { Card, Button, Input, Textarea } from '@/components/ui'
import {
  Headset,
  Envelope,
  Phone,
  ChatCircle,
  Clock,
  Ticket,
  CheckCircle,
} from '@phosphor-icons/react'

/**
 * Support Method Component
 */
interface SupportMethodProps {
  icon: React.ReactNode
  title: string
  description: string
  detail: string
  availability: string
}

const SupportMethod: React.FC<SupportMethodProps> = ({
  icon,
  title,
  description,
  detail,
  availability
}) => (
  <Card variant="default" padding="lg" className="text-center">
    <div className="inline-flex items-center justify-center rounded-full bg-verve-100 p-4 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-slate-600 dark:text-slate-400">{description}</p>
    <p className="mt-1 font-medium text-verve-600 dark:text-verve-400">{detail}</p>
    <div className="mt-4 flex items-center justify-center gap-1 text-sm text-slate-500 dark:text-slate-400">
      <Clock size={16} />
      <span>{availability}</span>
    </div>
  </Card>
)

/**
 * FAQ Quick Link Component
 */
interface FAQQuickLinkProps {
  question: string
  href: string
}

const FAQQuickLink: React.FC<FAQQuickLinkProps> = ({ question, href }) => (
  <a
    href={href}
    className="flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:border-verve-300 hover:bg-verve-50 dark:border-slate-700 dark:hover:border-verve-700 dark:hover:bg-verve-900/20"
  >
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{question}</span>
    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </a>
)

/**
 * Support Page
 */
export default function SupportPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <PublicLayout>
      <div className="container-verve py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-verve-100 p-3 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400 mb-4">
            <Headset size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Trung tâm hỗ trợ
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Liên hệ qua các kênh bên dưới hoặc gửi yêu cầu trực tiếp.
          </p>
        </div>

        {/* Support Methods */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          <SupportMethod
            icon={<Envelope size={28} />}
            title="Email"
            description="Gửi yêu cầu qua email"
            detail="contact@verveai.example.com"
            availability="Phản hồi trong 24 giờ"
          />
          <SupportMethod
            icon={<Phone size={28} />}
            title="Điện thoại"
            description="Gọi trực tiếp với chúng tôi"
            detail="+84 123 456 789"
            availability="T2-T6: 8:00 - 18:00"
          />
          <SupportMethod
            icon={<ChatCircle size={28} />}
            title="Live Chat"
            description="Trò chuyện trực tiếp"
            detail="Online ngay"
            availability="T2-T7: 8:00 - 22:00"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card variant="default" padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <Ticket size={24} className="text-verve-600 dark:text-verve-400" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Gửi yêu cầu hỗ trợ
                </h2>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center rounded-full bg-success-100 p-4 text-success-600 dark:bg-success-900/30 dark:text-success-400 mb-4">
                    <CheckCircle size={32} weight="fill" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Yêu cầu đã được gửi!
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', subject: '', message: '' })
                    }}
                  >
                    Gửi yêu cầu khác
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Họ và tên <span className="text-error-500">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Email <span className="text-error-500">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Chủ đề <span className="text-error-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-verve-500 focus:outline-none focus:ring-2 focus:ring-verve-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="technical">Hỗ trợ kỹ thuật</option>
                      <option value="account">Vấn đề tài khoản</option>
                      <option value="billing">Thanh toán & Hóa đơn</option>
                      <option value="feature">Yêu cầu tính năng mới</option>
                      <option value="feedback">Góp ý & Phản hồi</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nội dung <span className="text-error-500">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu của bạn..."
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    Gửi yêu cầu
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick FAQ */}
            <Card variant="default" padding="lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Câu hỏi thường gặp
              </h3>
              <div className="space-y-2">
                <FAQQuickLink
                  question="Làm sao đăng ký tài khoản?"
                  href="/faq"
                />
                <FAQQuickLink
                  question="Quên mật khẩu thì làm sao?"
                  href="/faq"
                />
                <FAQQuickLink
                  question="Hệ thống có miễn phí không?"
                  href="/faq"
                />
                <FAQQuickLink
                  question="Dữ liệu có được bảo mật không?"
                  href="/faq"
                />
              </div>
              <a
                href="/faq"
                className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-verve-600 hover:text-verve-700 dark:text-verve-400 dark:hover:text-verve-300"
              >
                Xem tất cả FAQ
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </Card>

            {/* Working Hours */}
            <Card variant="default" padding="lg" className="bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Giờ làm việc
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Thứ Hai - Thứ Sáu</span>
                  <span className="font-medium text-slate-900 dark:text-white">8:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Thứ Bảy</span>
                  <span className="font-medium text-slate-900 dark:text-white">9:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Chủ Nhật</span>
                  <span className="font-medium text-slate-500 dark:text-slate-500">Đóng cửa</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                * Ngoài giờ làm việc, email sẽ được phản hồi vào ngày làm việc tiếp theo.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
