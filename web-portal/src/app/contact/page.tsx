// ============================================
// VERVE AI - Contact Page
// ============================================

'use client'

import * as React from 'react'
import { PublicLayout } from '@/components/public'
import { Card, Button, Input, Textarea } from '@/components/ui'
import {
  MapPin,
  Envelope,
  Phone,
  Clock,
  FacebookLogo,
  YoutubeLogo,
  LinkedinLogo,
  CheckCircle,
} from '@phosphor-icons/react'

/**
 * Contact Info Item Component
 */
interface ContactInfoItemProps {
  icon: React.ReactNode
  title: string
  details: string[]
}

const ContactInfoItem: React.FC<ContactInfoItemProps> = ({ icon, title, details }) => (
  <div className="flex items-start gap-4">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-verve-100 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
      {details.map((detail, index) => (
        <p key={index} className="mt-1 text-slate-600 dark:text-slate-400">{detail}</p>
      ))}
    </div>
  </div>
)

/**
 * Social Link Component
 */
interface SocialLinkProps {
  icon: React.ReactNode
  label: string
  href: string
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, label, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-slate-600 transition-colors hover:border-verve-300 hover:text-verve-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-verve-700 dark:hover:text-verve-400"
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </a>
)

/**
 * Contact Page
 */
export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Liên hệ với chúng tôi
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
            Bạn có câu hỏi hoặc muốn hợp tác? Hãy liên hệ, chúng tôi luôn sẵn sàng lắng nghe.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card variant="default" padding="lg">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Gửi tin nhắn
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center rounded-full bg-success-100 p-4 text-success-600 dark:bg-success-900/30 dark:text-success-400 mb-4">
                    <CheckCircle size={32} weight="fill" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Tin nhắn đã được gửi!
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
                    }}
                  >
                    Gửi tin nhắn khác
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Số điện thoại
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+84 123 456 789"
                      />
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
                        <option value="sales">Hợp tác kinh doanh</option>
                        <option value="school">Triển khai cho trường học</option>
                        <option value="partnership">Đối tác công nghệ</option>
                        <option value="media">Báo chí & Truyền thông</option>
                        <option value="career">Tuyển dụng</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
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
                      placeholder="Viết nội dung tin nhắn của bạn..."
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    Gửi tin nhắn
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card variant="default" padding="lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
                Thông tin liên hệ
              </h3>
              <div className="space-y-6">
                <ContactInfoItem
                  icon={<MapPin size={24} />}
                  title="Địa chỉ"
                  details={[
                    "Tầng 15, Tòa nhà ABC Tower",
                    "123 Nguyễn Huệ, Quận 1",
                    "TP. Hồ Chí Minh, Việt Nam"
                  ]}
                />
                <ContactInfoItem
                  icon={<Envelope size={24} />}
                  title="Email"
                  details={[
                    "contact@verveai.example.com",
                    "support@verveai.example.com"
                  ]}
                />
                <ContactInfoItem
                  icon={<Phone size={24} />}
                  title="Điện thoại"
                  details={[
                    "+84 28 1234 5678",
                    "+84 123 456 789"
                  ]}
                />
                <ContactInfoItem
                  icon={<Clock size={24} />}
                  title="Giờ làm việc"
                  details={[
                    "Thứ Hai - Thứ Sáu: 8:00 - 18:00",
                    "Thứ Bảy: 9:00 - 15:00"
                  ]}
                />
              </div>
            </Card>

            {/* Social Links */}
            <Card variant="default" padding="lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Kết nối với chúng tôi
              </h3>
              <div className="flex flex-wrap gap-2">
                <SocialLink
                  icon={<FacebookLogo size={20} />}
                  label="Facebook"
                  href="#"
                />
                <SocialLink
                  icon={<YoutubeLogo size={20} />}
                  label="YouTube"
                  href="#"
                />
                <SocialLink
                  icon={<LinkedinLogo size={20} />}
                  label="LinkedIn"
                  href="#"
                />
              </div>
            </Card>

            {/* Map Placeholder */}
            <Card variant="default" padding="none" className="overflow-hidden">
              <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Bản đồ sẽ được cập nhật
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
