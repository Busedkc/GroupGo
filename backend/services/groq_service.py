"""Groq (LLaMA 3.3) destekli grup önerisi servisi."""

import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "llama-3.3-70b-versatile"
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def _format_response(r: dict) -> str:
    preferred_dates = r.get("preferred_dates") or []
    preferred_date_range = " - ".join(preferred_dates[:2]) if preferred_dates else "Belirtilmedi"
    preferred_places = ", ".join(r.get("preferred_countries") or []) or "Belirtilmedi"
    interests = ", ".join(r.get("interests") or []) or "Belirtilmedi"
    budget_min = r.get("budget_min")
    budget_max = r.get("budget_max")
    budget = (
        f"{budget_min}₺ - {budget_max}₺" if budget_min or budget_max else "Belirtilmedi"
    )
    notes = r.get("notes") or "-"
    return (
        f"- {r.get('participant_name', '?')}:\n"
        f"  Bütçe: {budget}\n"
        f"  Tercih edilen tarihler: {preferred_date_range}\n"
        f"  Tercih edilen yerler: {preferred_places}\n"
        f"  İlgi alanları: {interests}\n"
        f"  Notlar: {notes}\n"
    )


def _collect_unique(responses: list, key: str) -> list:
    seen = []
    for r in responses:
        for item in r.get(key) or []:
            if item and item not in seen:
                seen.append(item)
    return seen


def get_recommendation(trip: dict, responses: list) -> str:
    responses_text = "".join(_format_response(r) for r in responses)
    mode = (trip.get("mode") or "trip").lower()
    city = trip.get("city")

    all_interests = _collect_unique(responses, "interests")
    all_places = _collect_unique(responses, "preferred_countries")
    interests_line = ", ".join(all_interests) if all_interests else "Belirtilmemiş"
    places_line = ", ".join(all_places) if all_places else "Belirtilmemiş"

    language_rules = (
        "ÇOK ÖNEMLİ: Cevabı TAMAMEN Türkçe yaz. "
        "Sadece Latin alfabesi kullan. Arapça, Çince, Japonca, Kiril veya başka hiçbir alfabeden karakter kullanma. "
        "Emoji kullanabilirsin. Kısa, net ve samimi bir dil kullan. "
        "Tüm para birimlerini Türk Lirası (₺ veya TL) olarak yaz; dolar ($, USD) veya euro (€, EUR) kullanma."
    )

    price_context = (
        "GÜNCEL TÜRKİYE FİYAT REFERANSI (2026, enflasyon dahil — bütçe önerirken bu seviyeleri kullan):\n"
        "- Kafede filtre kahve / latte: 120-200₺\n"
        "- Kafede tatlı (cheesecake, brownie vb.): 250-450₺\n"
        "- Brunch (kişi başı): 600-1.200₺\n"
        "- Orta segment restoranda ana yemek: 400-900₺\n"
        "- Restoranda akşam yemeği (içecek dahil, kişi başı): 800-2.000₺\n"
        "- Bar/club giriş + 2 içecek: 1.000-2.500₺\n"
        "- Müze bileti: 150-600₺\n"
        "- Şehir içi taksi (kısa): 150-400₺\n"
        "- 1 gece otel (orta segment, İstanbul/Antalya): 3.000-8.000₺\n"
        "- Yurt içi uçak bileti (tek yön, orta sezon): 2.500-6.000₺\n"
        "- Yurt dışı uçak bileti (Avrupa, gidiş-dönüş): 15.000-45.000₺\n"
        "Bu referansları dikkate alarak bütçe tahmini yaz. "
        "100₺ / 250₺ gibi düşük, eski fiyatlar ASLA kullanma — artık gerçekçi değil."
    )

    format_rules = (
        "Cevabı şu formatta ver (Markdown başlık veya tablo kullanma):\n"
        "Her ana bölüm için: 'N. **Başlık:** kısa açıklama' formatı.\n"
        "Alt maddeler için başında '* ' olan satırlar kullan.\n"
        "Mekân önerilerinde mutlaka GERÇEK, spesifik yer isimleri ver (örn. 'Konyaaltı Plajı', 'Club Arma', "
        "'Salt Galata', 'Köprülü Kanyon rafting'). Genel ifadelerden ('bir plaj', 'güzel bir kafe') kaçın."
    )

    if mode == "city":
        prompt = f"""
Sen {city or 'şehirdeki'} arkadaş gruplarına özel, spesifik mekân önerileri veren yerel bir rehbersin.

Gezi: {trip.get('title')}
Şehir: {city or 'belirtilmedi'}

Grup yanıtları:
{responses_text}

Grubun ortak ilgi alanları: {interests_line}
Grubun tercih ettiği mahalleler: {places_line}

Görevin: Aşağıdaki yapıda, {city or 'şehirde'} somut ve gerçek mekân isimleri ile öneri hazırla.

1. **Önerilen mahalle:** Buluşulacak en iyi bölge ve neden (1-2 cümle).
2. **Mekân önerileri:** Grubun HER ilgi alanı için en az 2 SPESİFİK mekân öner. Format:
   * [İlgi alanı] — Mekân adı: kısa açıklama (nerede, neden uygun)
   Örnek:
   * Cafe — Federal Karaköy: sabah kahvesi için, merkezi ve sessiz.
   * Brunch — Mumbo: geç kahvaltı için bol seçenekli.
3. **Önerilen rota:** Saat saat gerçekçi bir gün/akşam planı (her durak gerçek bir mekân).
4. **Bütçe tahmini (TL):** Kişi başı tahmini harcama aralığı. GÜNCEL Türkiye fiyatlarını kullan.

{price_context}

{format_rules}
{language_rules}
"""
    else:
        prompt = f"""
Sen bir grup gezisi planlama asistanısın. Görevin: spesifik, gerçek mekân ve rota önerileri sunmak.

Gezi: {trip.get('title')}

Grup yanıtları:
{responses_text}

Grubun ortak ilgi alanları: {interests_line}
Grubun tercih ettiği destinasyonlar: {places_line}

Görevin: Aşağıdaki yapıda, somut ve gerçek yer isimleri ile öneri hazırla.

1. **Önerilen destinasyon:** En uygun şehir/ülke ve kısa gerekçe (1-2 cümle).
2. **Önerilen tarih aralığı:** Çoğu kişiye uyan tarih (tek aralık).
3. **Önerilen bütçe (TL):** Ortak bütçe aralığı, Türk Lirası cinsinden (örn. 25.000₺ - 50.000₺).
4. **Mekân ve aktivite önerileri:** Grubun HER ilgi alanı için önerilen destinasyonda en az 2 SPESİFİK mekân/aktivite öner. Format:
   * [İlgi alanı] — Yer adı: kısa açıklama.
   Örnek Antalya için:
   * Beach — Konyaaltı Plajı: şehir içi erişim, uzun kumsal.
   * Nightlife — Club Arma: liman manzaralı, genç kalabalık.
   * Adventure — Köprülü Kanyon rafting: yarım günlük doğa aktivitesi.
5. **Önerilen rota:** Gün gün gerçekçi bir plan (her gün için 2-3 gerçek mekân ismi).

{price_context}

{format_rules}
{language_rules}
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content
