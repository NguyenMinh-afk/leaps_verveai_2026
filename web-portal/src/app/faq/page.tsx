// ============================================
// VERVE AI - FAQ Page
// ============================================

'use client'

import * as React from 'react'
import { PublicLayout } from '@/components/public'
import { Card } from '@/components/ui'
import {
  Question,
  CaretDown,
  CaretUp,
  ChatCircle,
  User,
  Lock,
  CreditCard,
  Gear,
} from '@phosphor-icons/react'

/**
 * FAQ Item Component
 */
interface FAQItemProps {
  question: string
  answer: string
  category?: string
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, category }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-verve-600 dark:hover:text-verve-400"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {category && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {category}
            </span>
          )}
          <span className="font-medium text-slate-900 dark:text-white">{question}</span>
        </div>
        {isOpen ? (
          <CaretUp size={20} className="shrink-0 text-slate-400" />
        ) : (
          <CaretDown size={20} className="shrink-0 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}

/**
 * FAQ Category Component
 */
interface FAQCategoryProps {
  title: string
  icon: React.ReactNode
  faqs: FAQItemProps[]
}

const FAQCategory: React.FC<FAQCategoryProps> = ({ title, icon, faqs }) => (
  <Card variant="default" padding="lg">
    <div className="flex items-center gap-3 mb-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
    </div>
    <div>
      {faqs.map((faq, index) => (
        <FAQItem key={index} {...faq} />
      ))}
    </div>
  </Card>
)

/**
 * FAQ Page
 */
export default function FAQPage() {
  return (
    <PublicLayout>
      <div className="container-verve py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-verve-100 p-3 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400 mb-4">
            <Question size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Câu hỏi thường gặp
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
            Tìm câu trả lời nhanh cho các câu hỏi phổ biến về VERVE AI
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Tài khoản */}
          <FAQCategory
            title="Tài khoản & Đăng nhập"
            icon={<User size={24} />}
            faqs={[
              {
                question: "Làm sao để đăng ký tài khoản VERVE AI?",
                answer: "Bạn có thể đăng ký bằng email hoặc sử dụng tài khoản Google. Nếu là học sinh, tài khoản sẽ được giáo viên tạo và cung cấp cho bạn.",
                category: "Đăng ký"
              },
              {
                question: "Tôi quên mật khẩu, phải làm sao?",
                answer: "Nhấn 'Quên mật khẩu' trên trang đăng nhập và nhập email đã đăng ký. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu qua email.",
                category: "Đăng nhập"
              },
              {
                question: "Có thể đổi email đã đăng ký không?",
                answer: "Hiện tại, email là tên đăng nhập cố định. Nếu cần thay đổi, vui lòng liên hệ bộ phận hỗ trợ.",
                category: "Tài khoản"
              }
            ]}
          />

          {/* Sử dụng */}
          <FAQCategory
            title="Sử dụng hệ thống"
            icon={<Gear size={24} />}
            faqs={[
              {
                question: "Làm sao để tạo lớp học mới?",
                answer: "Giáo viên có thể tạo lớp học từ trang 'Lớp học'. Nhấn 'Tạo lớp mới', nhập thông tin và thêm học sinh vào lớp.",
                category: "Giáo viên"
              },
              {
                question: "Hệ thống có hoạt động offline không?",
                answer: "VERVE AI được thiết kế theo mô hình offline-first. Dữ liệu học tập được lưu trữ cục bộ và đồng bộ khi có kết nối internet.",
                category: "Kỹ thuật"
              },
              {
                question: "Làm sao xem báo cáo tiến độ học tập?",
                answer: "Giáo viên có thể xem báo cáo từ trang Dashboard hoặc trang chi tiết từng học sinh. Học sinh có thể xem từ trang 'Mức độ thành thạo'.",
                category: "Báo cáo"
              }
            ]}
          />

          {/* Bài tập & Kiểm tra */}
          <FAQCategory
            title="Bài tập & Kiểm tra"
            icon={<ChatCircle size={24} />}
            faqs={[
              {
                question: "Có thể tạo bài tập từ file không?",
                answer: "Có, bạn có thể tải lên file tài liệu (PDF, Word) và hệ thống AI sẽ hỗ trợ tạo câu hỏi tự động từ nội dung đó.",
                category: "Tạo bài tập"
              },
              {
                question: "Học sinh có thể làm bài trên điện thoại không?",
                answer: "Có, giao diện VERVE AI hoàn toàn tương thích với điện thoại và máy tính bảng, không chỉ trên máy tính.",
                category: "Thiết bị"
              },
              {
                question: "Bài kiểm tra có giới hạn thời gian không?",
                answer: "Giáo viên có thể đặt thời gian làm bài hoặc cho phép làm không giới hạn. Thông tin này hiển thị rõ khi học sinh bắt đầu làm bài.",
                category: "Kiểm tra"
              }
            ]}
          />

          {/* Thanh toán */}
          <FAQCategory
            title="Thanh toán & Gói dịch vụ"
            icon={<CreditCard size={24} />}
            faqs={[
              {
                question: "VERVE AI có miễn phí không?",
                answer: "Chúng tôi có gói miễn phí với các tính năng cơ bản. Gói trả phí cung cấp thêm AI tạo câu hỏi, báo cáo nâng cao và không giới hạn học sinh.",
                category: "Giá"
              },
              {
                question: "Làm sao để nâng cấp gói dịch vụ?",
                answer: "Truy cập trang 'Cài đặt' > 'Thanh toán' để xem các gói và nâng cấp. Thanh toán an toàn qua thẻ Visa, Mastercard hoặc chuyển khoản.",
                category: "Nâng cấp"
              },
              {
                question: "Có hoàn tiền nếu không hài lòng không?",
                answer: "Chúng tôi cung cấp hoàn tiền trong vòng 30 ngày đầu tiên nếu bạn không hài lòng với dịch vụ.",
                category: "Chính sách"
              }
            ]}
          />

          {/* Bảo mật */}
          <FAQCategory
            title="Bảo mật & Quyền riêng tư"
            icon={<Lock size={24} />}
            faqs={[
              {
                question: "Dữ liệu học tập của học sinh có an toàn không?",
                answer: "Chúng tôi cam kết bảo mật dữ liệu theo tiêu chuẩn quốc tế. Dữ liệu được mã hóa và chỉ người dùng được ủy quyền mới có thể truy cập.",
                category: "Bảo mật"
              },
              {
                question: "Ai có thể xem dữ liệu học sinh?",
                answer: "Chỉ giáo viên được phân công dạy lớp đó và phụ huynh (nếu được kích hoạt) mới có quyền xem dữ liệu học sinh.",
                category: "Quyền riêng tư"
              }
            ]}
          />
        </div>

        {/* Contact Banner */}
        <Card variant="default" padding="lg" className="mt-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Không tìm thấy câu trả lời?
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Liên hệ với chúng tôi, đội ngũ hỗ trợ sẵn sàng giúp bạn 24/7.
            </p>
            <a
              href="/support"
              className="inline-flex items-center gap-2 mt-4 text-verve-600 hover:text-verve-700 dark:text-verve-400 dark:hover:text-verve-300 font-medium"
            >
              Liên hệ hỗ trợ
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </Card>
      </div>
    </PublicLayout>
  )
}
