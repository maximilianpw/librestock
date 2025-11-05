package models

import (
	"time"
)

type SortlyItem struct {
	EntryName         string    `csv:"Entry Name"`
	VariantDetails    string    `csv:"Variant Details"`
	SortlyID          string    `csv:"Sortly ID (SID)"`
	Unit              string    `csv:"Unit"`
	MinLevel          string    `csv:"Min Level"`
	Price             string    `csv:"Price"`
	Value             string    `csv:"Value"`
	Notes             string    `csv:"Notes"`
	Tags              string    `csv:"Tags"`
	BarcodeQR1Data    string    `csv:"Barcode/QR1-Data"`
	BarcodeQR1Type    string    `csv:"Barcode/QR1-Type"`
	BarcodeQR2Data    string    `csv:"Barcode/QR2-Data"`
	BarcodeQR2Type    string    `csv:"Barcode/QR2-Type"`
	TransactionDate   string    `csv:"Transaction Date (CEST)"`
	TransactionType   string    `csv:"Transaction Type"`
	QtyChange         string    `csv:"QTY change (Quantity Delta)"`
	NewQty            string    `csv:"New QTY"`
	Folder            string    `csv:"Folder"`
	FolderSID         string    `csv:"Folder SID"`
	User              string    `csv:"User"`
	TransactionNote   string    `csv:"Transaction Note"`
	Location          string    `csv:"Location"`
	ExpiryDate        string    `csv:"Expiry Date"`
}

type SortlyFolder struct {
	Name      string
	SortlyID  string
	IsBrand   bool
}

func (s *SortlyItem) ParseExpiryDate() (*time.Time, error) {
	if s.ExpiryDate == "" {
		return nil, nil
	}

	formats := []string{
		"02/01/2006",
		"2006-01-02",
		"01/02/2006",
	}

	for _, format := range formats {
		if t, err := time.Parse(format, s.ExpiryDate); err == nil {
			return &t, nil
		}
	}

	return nil, nil
}

func (s *SortlyItem) ParseTransactionDate() (*time.Time, error) {
	if s.TransactionDate == "" {
		return nil, nil
	}

	formats := []string{
		"02/01/2006 03:04PM",
		"02/01/2006 3:04PM",
		"2006-01-02 15:04:05",
	}

	for _, format := range formats {
		if t, err := time.Parse(format, s.TransactionDate); err == nil {
			return &t, nil
		}
	}

	return nil, nil
}
