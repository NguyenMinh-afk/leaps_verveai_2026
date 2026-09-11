// ============================================
// VERVE AI - Điều khoản sử dụng
// ============================================

'use client'

import * as React from 'react'
import { PublicLayout } from '@/components/public'
import { Card } from '@/components/ui'
import { FileText, Clock, Shield, WarningCircle } from '@phosphor-icons/react'

/**
 * Section Component
 */
interface SectionProps {
  id: string
  title: string
  content: React.ReactNode
}

const Section: React.FC<SectionProps> = ({ id, title, content }) => (
  <div id={id} className="mb-8 scroll-mt-20">
    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{title}</h2>
    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
      {content}
    </div>
  </div>
)

/**
 * Điều khoản sử dụng Page
 */
export default function TermsPage() {
  const lastUpdated = "11 tháng 9, 2024"

  return (
    <PublicLayout>
      <div className="container-verve py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-verve-100 p-3 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400 mb-4">
            <FileText size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Điều khoản sử dụng
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Clock size={16} />
            <span>Cập nhật lần cuối: {lastUpdated}</span>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl">
          <Card variant="default" padding="lg" className="mb-8">
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Chào mừng bạn đến với VERVE AI. Bằng việc truy cập và sử dụng nền tảng VERVE AI, bạn đồng ý
              tuân thủ các Điều khoản sử dụng này. Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
            </p>

            <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
              <WarningCircle size={20} className="shrink-0 mt-0.5" />
              <p>
                Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của VERVE AI.
              </p>
            </div>
          </Card>

          <Card variant="default" padding="lg">
            {/* 1. Giới thiệu */}
            <Section
              id="introduction"
              title="1. Giới thiệu"
              content={
                <div className="space-y-4">
                  <p>
                    VERVE AI ("Chúng tôi", "VERVE AI" hoặc "Nền tảng") là nền tảng giáo dục thông minh
                    cung cấp các công cụ hỗ trợ giảng dạy và học tập, bao gồm nhưng không giới hạn:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Tạo câu hỏi và bài tập tự động bằng AI</li>
                    <li>Theo dõi mức độ thành thạo của học sinh</li>
                    <li>Phân tích dữ liệu học tập và đưa ra can thiệp</li>
                    <li>Quản lý lớp học và báo cáo tiến độ</li>
                  </ul>
                  <p>
                    Các Điều khoản sử dụng này ("Điều khoản") quy định quyền và nghĩa vụ của bạn khi sử dụng
                    dịch vụ và được lập theo quy định pháp luật Việt Nam hiện hành.
                  </p>
                </div>
              }
            />

            {/* 2. Tài khoản */}
            <Section
              id="accounts"
              title="2. Tài khoản và Đăng ký"
              content={
                <div className="space-y-4">
                  <p>Để sử dụng VERVE AI, bạn cần tạo tài khoản. Khi đăng ký, bạn cam kết:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
                    <li>Bảo mật thông tin đăng nhập và chịu trách nhiệm về mọi hoạt động dưới tài khoản của mình</li>
                    <li>Thông báo ngay cho chúng tôi nếu phát hiện việc sử dụng trái phép tài khoản</li>
                    <li>Không cho phép người khác sử dụng tài khoản của bạn</li>
                  </ul>
                  <p>
                    VERVE AI có quyền đình chỉ hoặc chấm dứt tài khoản nếu vi phạm Điều khoản này
                    hoặc pháp luật hiện hành.
                  </p>
                </div>
              }
            />

            {/* 3. Quyền của Giáo viên */}
            <Section
              id="teacher-rights"
              title="3. Quyền và Nghĩa vụ của Giáo viên"
              content={
                <div className="space-y-4">
                  <p><strong>Giáo viên có quyền:</strong></p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Tạo, chỉnh sửa và quản lý bài tập, bài kiểm tra</li>
                    <li>Theo dõi tiến độ học tập của học sinh trong lớp được phân công</li>
                    <li>Sử dụng tính năng AI để hỗ trợ giảng dạy</li>
                    <li>Xuất báo cáo và dữ liệu học tập</li>
                  </ul>
                  <p><strong>Giáo viên có nghĩa vụ:</strong></p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Sử dụng nền tảng đúng mục đích giáo dục</li>
                    <li>Bảo mật thông tin học sinh theo quy định</li>
                    <li>Không chia sẻ nội dung câu hỏi cho mục đích gian lận</li>
                    <li>Tuân thủ hướng dẫn sử dụng của VERVE AI</li>
                  </ul>
                </div>
              }
            />

            {/* 4. Quyền của Học sinh */}
            <Section
              id="student-rights"
              title="4. Quyền và Nghĩa vụ của Học sinh"
              content={
                <div className="space-y-4">
                  <p><strong>Học sinh có quyền:</strong></p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Truy cập bài tập và tài liệu học tập được giao</li>
                    <li>Xem tiến độ và mức độ thành thạo cá nhân</li>
                    <li>Nhận đề xuất học tập phù hợp</li>
                  </ul>
                  <p><strong>Học sinh có nghĩa vụ:</strong></p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Làm bài tập và kiểm tra một cách trung thực</li>
                    <li>Không sử dụng công cụ gian lận</li>
                    <li>Bảo mật thông tin tài khoản</li>
                  </ul>
                </div>
              }
            />

            {/* 5. Nội dung */}
            <Section
              id="content"
              title="5. Nội dung và Sở hữu trí tuệ"
              content={
                <div className="space-y-4">
                  <p>
                    <strong>Nội dung do người dùng tạo:</strong> Bạn giữ quyền sở hữu đối với nội dung
                    bạn tạo ra trên VERVE AI. Bằng việc đăng tải nội dung, bạn cấp cho VERVE AI quyền
                    sử dụng, lưu trữ và hiển thị nội dung đó để cung cấp dịch vụ.
                  </p>
                  <p>
                    <strong>Nội dung do AI tạo:</strong> Các câu hỏi và nội dung do VERVE AI tạo ra thuộc
                    quyền sở hữu của VERVE AI và có thể được sử dụng để cải thiện dịch vụ.
                  </p>
                  <p>
                    Bạn không được phép sao chép, phân phối hoặc sử dụng nội dung của VERVE AI cho mục đích
                    thương mại khi chưa có sự đồng ý bằng văn bản.
                  </p>
                </div>
              }
            />

            {/* 6. Bảo mật */}
            <Section
              id="security"
              title="6. Bảo mật và Dữ liệu"
              content={
                <div className="space-y-4">
                  <p>VERVE AI cam kết bảo vệ dữ liệu cá nhân của bạn theo:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Luật An ninh mạng và Luật Bảo vệ dữ liệu cá nhân của Việt Nam</li>
                    <li>Chính sách bảo mật của VERVE AI</li>
                    <li>Các tiêu chuẩn bảo mật quốc tế</li>
                  </ul>
                  <p>
                    Chi tiết về việc thu thập, xử lý và bảo vệ dữ liệu được quy định trong{' '}
                    <a href="/privacy" className="text-verve-600 hover:text-verve-700 dark:text-verve-400">
                      Chính sách bảo mật
                    </a>.
                  </p>
                </div>
              }
            />

            {/* 7. Thanh toán */}
            <Section
              id="payment"
              title="7. Thanh toán và Hoàn tiền"
              content={
                <div className="space-y-4">
                  <p>
                    <strong>Gói miễn phí:</strong> VERVE AI cung cấp gói miễn phí với các tính năng cơ bản.
                    Việc sử dụng gói miễn phí tuân thủ các Điều khoản này.
                  </p>
                  <p>
                    <strong>Gói trả phí:</strong> Khi nâng cấp lên gói trả phí:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Thanh toán được thực hiện theo chu kỳ (tháng hoặc năm)</li>
                    <li>Giá có thể thay đổi với thông báo trước 30 ngày</li>
                    <li>Hoàn tiền 100% trong vòng 30 ngày nếu không hài lòng</li>
                  </ul>
                </div>
              }
            />

            {/* 8. Giới hạn trách nhiệm */}
            <Section
              id="liability"
              title="8. Giới hạn Trách nhiệm"
              content={
                <div className="space-y-4">
                  <p>
                    VERVE AI không chịu trách nhiệm về:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Thiệt hại gián tiếp, đặc biệt hoặc do hậu quả phát sinh từ việc sử dụng dịch vụ</li>
                    <li>Mất dữ liệu do lỗi của người dùng hoặc bên thứ ba</li>
                    <li>Gián đoạn dịch vụ do bảo trì hoặc lỗi kỹ thuật</li>
                    <li>Hành vi của người dùng khác trên nền tảng</li>
                  </ul>
                  <p>
                    Trách nhiệm của VERVE AI được giới hạn tối đa bằng số tiền bạn đã thanh toán trong 12 tháng
                    gần nhất (nếu có).
                  </p>
                </div>
              }
            />

            {/* 9. Chấm dứt */}
            <Section
              id="termination"
              title="9. Chấm dứt Dịch vụ"
              content={
                <div className="space-y-4">
                  <p>
                    <strong>Chấm dứt bởi bạn:</strong> Bạn có thể ngừng sử dụng dịch vụ và xóa tài khoản
                    bất kỳ lúc nào thông qua cài đặt tài khoản.
                  </p>
                  <p>
                    <strong>Chấm dứt bởi VERVE AI:</strong> Chúng tôi có thể chấm dứt hoặc đình chỉ tài khoản
                    nếu vi phạm Điều khoản hoặc pháp luật.
                  </p>
                  <p>
                    Khi chấm dứt, dữ liệu của bạn sẽ được xử lý theo Chính sách bảo mật.
                  </p>
                </div>
              }
            />

            {/* 10. Sửa đổi */}
            <Section
              id="amendments"
              title="10. Sửa đổi Điều khoản"
              content={
                <div className="space-y-4">
                  <p>
                    VERVE AI có quyền sửa đổi các Điều khoản này. Khi có thay đổi quan trọng, chúng tôi sẽ:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Thông báo qua email hoặc thông báo trên nền tảng</li>
                    <li>Cập nhật ngày "Cập nhật lần cuối" ở đầu trang</li>
                    <li>Cho phép bạn từ chối các điều khoản mới trong vòng 30 ngày</li>
                  </ul>
                  <p>
                    Việc tiếp tục sử dụng sau khi Điều khoản được sửa đổi đồng nghĩa với việc bạn chấp nhận
                    các thay đổi đó.
                  </p>
                </div>
              }
            />

            {/* 11. Liên hệ */}
            <Section
              id="contact"
              title="11. Liên hệ"
              content={
                <div className="space-y-4">
                  <p>
                    Nếu có câu hỏi về Điều khoản sử dụng này, vui lòng liên hệ:
                  </p>
                  <ul className="list-none space-y-2">
                    <li><strong>Email:</strong> contact@verveai.example.com</li>
                    <li><strong>Điện thoại:</strong> +84 28 1234 5678</li>
                    <li><strong>Địa chỉ:</strong> Tầng 15, Tòa nhà ABC Tower, 123 Nguyễn Huệ, Quận 1, TP. HCM</li>
                  </ul>
                </div>
              }
            />
          </Card>
        </div>
      </div>
    </PublicLayout>
  )
}
